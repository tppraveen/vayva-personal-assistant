 
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const express = require('express');
const router = express.Router();
const pool = require('../db');
const handleError = require('../utils/errorHandler');
const response = require('../utils/responseHandler'); // Use response helper

 

const MAX_DAYS_LOOKAHEAD = 60;

async function onAppLaunch(username) {
  await updateMissedReminders(); 
  await generateRemindersForUser(username);
}

// 1. Update missed reminder statuses
async function updateMissedReminders() {
   try {
     await pool.query(`
      UPDATE reminderevents
      SET status = 'Missed'
      WHERE status = 'Upcoming' AND remind_at < NOW()
    `);
    console.log('✅ Missed reminders updated.');
  } catch (err) {
    console.error('❌ Failed to update missed reminders:', err);
  } 
}

// 2. Generate reminders from expenseremainder
async function generateRemindersForUser(username) {
   try {
    const configs = await getReminderConfigs(  username);
    for (const config of configs) {
      const reminder = await getReminder(  config.id);
      if (!reminder) continue;

      const baseInfo = {
        moduleName: 'expense',
        moduleConfigId: config.id,
        moduleReminderId: reminder.id,
        username,
        title: reminder.title || config.subcategory,
        description: reminder.description || '',
      };
        console.log(reminder.remainder_at +" - "+reminder.is_recurring)
      if (!reminder.is_recurring && reminder.remainder_at) {
        let date = new Date(reminder.remainder_at);
        console.log("Date - "+date)
        reminder.remainder_at = date.toISOString().replace('T', ' ').substring(0, 19); 
         console.log("dayjs(reminder.remainder_at) -- "+reminder.remainder_at)
         console.log("reminder.due_days -- "+ reminder.due_days)
          
        await createSingleReminder(  baseInfo, reminder.remainder_at, reminder.due_days);
      } else {
          
        await createRecurringReminders(  baseInfo, reminder);
      }
    }

    console.log('✅ Reminder generation complete.');
  } catch (err) {
    console.error('❌ Error generating reminders:', err);
  }  
}

// 3. Get all configs with isreminder = true
async function getReminderConfigs( username) {
  const res =  await pool.query(`
    SELECT * FROM expensecategoryconfig 
    WHERE isreminder = true AND username = $1
  `, [username]);
  return res.rows;
}

// 4. Get matching reminder config
async function getReminder( categoryId) {
  const res =  await pool.query(`
    SELECT * FROM expenseremainder 
    WHERE expense_category_id = $1
  `, [categoryId]);
  return res.rows[0];
}

// 5. Handle single-time reminders
async function createSingleReminder(  base, remindAt, dueDays ) {
   console.log("base - "+base)
    console.log("remindAt - "+remindAt)
     console.log("dueDays - "+dueDays)
  const endDate = remindAt.add(parseInt(dueDays || 0), 'day'); 
  if (!(await eventExists(  base.moduleName, base.moduleReminderId, remindAt))) {
    await insertReminder(  { ...base, remindAt });
  }
}

// 6. Generate recurring reminders
async function createRecurringReminders(  base, reminder) {
  
  const startDate = dayjs(reminder.start_date, 'DD-MM-YYYY');
  const endDate = dayjs(reminder.end_date, 'DD-MM-YYYY');
  const repeatTime = (reminder.repeat_time || '09:00:00').split(':');
 
  for (let i = 0; i < MAX_DAYS_LOOKAHEAD; i++) {
    const day = startDate.add(i, 'day');
    if (day.isAfter(endDate)) break;

    const remindAt = day
      .set('hour', repeatTime[0])
      .set('minute', repeatTime[1])
      .set('second', repeatTime[2]);
     
    const shouldCreate = shouldCreateReminder(reminder, day);
       console.log("4")
       console.log(base.moduleReminderId)
    if (shouldCreate && !(await eventExists(  base.moduleName, base.moduleReminderId, remindAt))) {
         console.log("5")
      await insertReminder( { ...base, remindAt });
      
    }
  }
}

// 7. Check if event already exists
async function eventExists(  moduleName, reminderId, remindAt) {
   console.log("21")
     console.log(moduleName)
       console.log(reminderId)
         console.log(remindAt)
  const res =  await pool.query(`
    SELECT 1 FROM reminderevents 
    WHERE module_name = $1 AND module_reminder_id = $2 AND remind_at = $3
  `, [moduleName, reminderId, remindAt.format('YYYY-MM-DD HH:mm:ss')]);
   console.log("22")
  return res.rowCount > 0;
}

// 8. Insert a reminder event
async function insertReminder( data) {
  console.log("Strat")
  console.log(data)
  console.log(data.remindAt.format('YYYY-MM-DD HH:mm:ss'))
   await pool.query(`
    INSERT INTO reminderevents (
      module_name, module_config_id, module_reminder_id,
      username, title, description, remind_at, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Upcoming')
  `, [
    data.moduleName,
    data.moduleConfigId,
    data.moduleReminderId,
    data.username,
    data.title,
    data.description,
    data.remindAt.format('YYYY-MM-DD HH:mm:ss')
  ]);
}

// 9. Decide if a reminder should be created for this day
function shouldCreateReminder(reminder, day) {
  const repeatType = reminder.repeat_type;
  const weekday = day.format('ddd'); // e.g., "Mon"
  const month = day.month() + 1;     // Jan = 1
  const dayOfMonth = day.date();

  switch (repeatType) {
    case 'Daily':
      return true;
    case 'Weekly':
      const repeatDays = safeJson(reminder.repeat_days); // ["Mon", "Wed"]
      return repeatDays.includes(weekday);
    case 'Monthly':
      const months = safeJson(reminder.repeat_month); // [1, 3, 6]
      const repeatDay = parseInt(reminder.repeat_day_of_month || '1');
      return months.includes(month) && dayOfMonth === repeatDay;
    case 'Yearly':
      const yearMonths = safeJson(reminder.repeat_month);
      return yearMonths.includes(month) && dayOfMonth === 1;
    default:
      return false;
  }
}

function safeJson(str) {
  try {
    return JSON.parse(str || '[]');
  } catch {
    return [];
  }
}


async function markReminderAsCompleted(eventId) {
   try {
    const res =  await pool.query(`
      UPDATE reminderevents
      SET status = 'Completed', completed_on = NOW()
      WHERE id = $1 AND status IN ('Upcoming', 'Missed')
      RETURNING *
    `, [eventId]);

    if (res.rowCount === 0) {
      console.log(`⚠️ No reminder updated. ID may not exist or already completed.`);
      return { success: false, message: 'No matching reminder to update.' };
    }

    console.log(`✅ Reminder ID ${eventId} marked as completed.`);
    return { success: true, data: res.rows[0] };

  } catch (err) {
    console.error('❌ Error updating reminder:', err);
    return { success: false, error: err };
  } finally {
   }
}
module.exports = {
    onAppLaunch
};