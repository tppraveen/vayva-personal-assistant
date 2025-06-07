const pool = require('../db');
const moment = require('moment-timezone');

const MODULE_NAME = 'ExpenseTracker';
const DEFAULT_DUE_DAYS = 5;
const REMINDER_CREATE_HOW_MANY_DAYS = 45;

const onAppLaunch = async (username) => {
  try {
    const result = await pool.query(` SELECT ecc.*, er.* 
      FROM expensecategoryconfig ecc
      JOIN expenseremainder er ON ecc.id = er.expense_category_id
      WHERE ecc.isreminder = true AND ecc.username = $1
    `, [username]);

    for (const row of result.rows) {
      const reminders = generateReminderEvents(row);

      for (const reminder of reminders) {
        const title = `${row.category} - ${row.subcategory}`;
        const description = row.notes || row.suggestions || '';
        const status = 'Upcoming';

        // Check if already exists
        const existing = await pool.query(`
          SELECT id, title, description, status 
          FROM reminderevents 
          WHERE username = $1 AND module_reminder_id = $2 AND remind_at = $3
        `, [username, row.id, reminder.remind_at]);

        if (existing.rows.length > 0) {
          const existingRow = existing.rows[0];
          const isDifferent =
            existingRow.title !== title ||
            existingRow.description !== description ||
            existingRow.status !== status;

          if (isDifferent) {
            await pool.query(`
              UPDATE reminderevents 
              SET title = $1, description = $2, status = $3, updated_on = $4 
              WHERE id = $5
            `, [
              title,
              description,
              status,
              reminder.updated_on,
              existingRow.id,
            ]);
          }
        } else {
          // Insert new reminder event
          await pool.query(`
            INSERT INTO reminderevents (
              module_name, module_config_id, module_reminder_id, username,
              title, description, remind_at, remainder_end, status, created_on, updated_on
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
          `, [
            MODULE_NAME,
            row.id,
            row.id,
            username,
            title,
            description,
            reminder.remind_at,
            reminder.remind_end,
            status,
            reminder.created_on,
            reminder.updated_on,
            
          ]);
        }
      }
    }
  } catch (err) {
    console.error('Error generating reminders:', err);
  }
  markMissedReminders (username)
 
};  

const generateReminderEvents = (reminder) => {
const events = [];

  const isRecurring = reminder.is_recurring;
  const repeatType = (reminder.repeat_type || '').toLowerCase();
  const repeatDays = reminder.repeat_days ? JSON.parse(reminder.repeat_days) : [];
  const repeatMonths = reminder.repeat_month ? JSON.parse(reminder.repeat_month) : [];
  const repeatDayOfMonth = reminder.repeat_day_of_month ? reminder.repeat_day_of_month.split(',').map(d => parseInt(d.trim(), 10)) : [];
  const repeatTime = reminder.repeat_time || '09:00:00';

  const startDate = moment(reminder.start_date, 'DD-MM-YYYY');
  const endDateInput = moment(reminder.end_date, 'DD-MM-YYYY');
  const cappedEndDate = moment.min(
    endDateInput,
    moment().add(REMINDER_CREATE_HOW_MANY_DAYS, 'days')
  );

  // Helper to create reminder event
  const createEvent = (remindAt) => ({
    remind_at: remindAt.toISOString(),
    remind_end: cappedEndDate.toISOString(),
    created_on: moment().toISOString(),
    updated_on: moment().toISOString(),
  });

  if (!isRecurring || repeatType === 'once') {
    const remindAt = moment(reminder.reminder_at);
    if (remindAt.isBefore(moment().add(REMINDER_CREATE_HOW_MANY_DAYS, 'days'))) {
      events.push(createEvent(remindAt));
    }
    return events;
  }

  if (repeatType === 'weekly') {
    const normalizedDays = repeatDays.map(d => d.toLowerCase().slice(0, 3));

    for (
      let day = moment(startDate.clone());
      day.isSameOrBefore(cappedEndDate);
      day.add(1, 'day')
    ) {
      const dayName = day.format('ddd').toLowerCase();
      if (normalizedDays.includes(dayName)) {
        const [hour, minute, second] = repeatTime.split(':').map(Number);
        const remindAt = day.clone().set({ hour, minute, second });
        if (remindAt.isBefore(moment().add(REMINDER_CREATE_HOW_MANY_DAYS, 'days'))) {
          events.push(createEvent(remindAt));
        }
      }
    }
  }

    if (repeatType === 'daily') {
    for ( 
      let day = moment(startDate.clone());
      day.isSameOrBefore(cappedEndDate);
      day.add(1, 'day')
    ) {
      const [hour, minute, second] = repeatTime.split(':').map(Number);
      const remindAt = day.clone().set({ hour, minute, second });

      events.push(createEvent(remindAt));
    } 
  }  
  if (repeatType === 'monthly') {
    for (
      let day = moment(startDate.clone());
      day.isSameOrBefore(cappedEndDate);
      day.add(1, 'day')
    ) {
      const currentMonth = day.month() + 1; // moment months are 0-indexed
      const currentDate = day.date();

      if (
        repeatMonths.includes(String(currentMonth)) &&
        repeatDayOfMonth.includes(currentDate)
      ) {
        const [hour, minute, second] = repeatTime.split(':').map(Number);
        const remindAt = day.clone().set({ hour, minute, second });

        if (remindAt.isBefore(moment().add(REMINDER_CREATE_HOW_MANY_DAYS, 'days'))) {
          events.push(createEvent(remindAt));
        }
      }
    }
  }

  if (repeatType === 'yearly') {
    for (
      let day = moment(startDate.clone());
      day.isSameOrBefore(cappedEndDate);
      day.add(1, 'day')
    ) {
      const currentMonth = day.month() + 1;
      const currentDate = day.date();

      if (
        repeatMonths.includes(String(currentMonth)) &&
        repeatDayOfMonth.includes(currentDate)
      ) {
        const [hour, minute, second] = repeatTime.split(':').map(Number);
        const remindAt = day.clone().set({ hour, minute, second });

        if (remindAt.isBefore(moment().add(REMINDER_CREATE_HOW_MANY_DAYS, 'days'))) {
          events.push(createEvent(remindAt));
        }
      }
    }
  }
 return events;
};

const generateReminderEvents2 = (reminder) => {
  const events = [];
  const now = moment();
  const startDate = moment(reminder.created_on);
  const endDate = moment().add(REMINDER_CREATE_HOW_MANY_DAYS, 'days');
  const repeatType = (reminder.recurringtype || '');
  const isRecurring = reminder.recurring === true || reminder.recurring === 'true';

  const repeatTime = reminder.repeat_time || '09:00';

  // Non-recurring or once
  if (!isRecurring || repeatType === 'once'|| repeatType === 'Once') {
    const remindAt = buildDateTime(startDate, repeatTime);
    events.push(createEvent(remindAt, now));
    return events;
  }

  // Recurring logic
  switch (repeatType) {
    case 'Daily':
      for (let i = 0; i < REMINDER_CREATE_HOW_MANY_DAYS; i++) {
        const date = moment(startDate).add(i, 'days');
        if (date.isAfter(endDate)) break;
        const remindAt = buildDateTime(date, repeatTime);
        events.push(createEvent(remindAt, now));
      }
      break;

    case 'Weekly':
      const weekdays = parseWeekdays(reminder.repeat_days); // ["mon", "wed"]
      for (let d = moment(startDate); d.isSameOrBefore(endDate); d.add(1, 'days')) {
        if (weekdays.includes(d.format('ddd').toLowerCase())) {
          const remindAt = buildDateTime(d, repeatTime);
         // console.log(remindAt, now)
          events.push(createEvent(remindAt, now));
        }
      }
      break;

    case 'Monthly':
      const repeatDays = parseCSV(reminder.repeat_day_of_month); // [1, 15]
      const repeatMonths = parseCSV(reminder.repeat_month);       // [1, 6, 12]
      const startYear = startDate.year();
      const endYear = endDate.year();

      for (let year = startYear; year <= endYear; year++) {
        for (const month of repeatMonths) {
          for (const day of repeatDays) {
            const date = moment(`${year}-${month}-${day}`, 'YYYY-M-D');
            if (date.isValid() && date.isBetween(startDate, endDate, undefined, '[]')) {
              const remindAt = buildDateTime(date, repeatTime);
              events.push(createEvent(remindAt, now));
            }
          }
        }
      }
      break;

    case 'Yearly':
      // Yearly logic can be built like monthly with years, months, and days
      // Example:
      // const years = parseCSV(reminder.repeat_years); // e.g. [2025, 2026]
      // for (const year of years) {
      //   for (const month of repeatMonths) {
      //     for (const day of repeatDays) {
      //       const date = moment(`${year}-${month}-${day}`, 'YYYY-M-D');
      //       const remindAt = buildDateTime(date, repeatTime);
      //       events.push(createEvent(remindAt, now));
      //     }
      //   }
      // }
      break;

    default:
      // Fallback to once
      const fallbackRemindAt = buildDateTime(startDate, repeatTime);
      events.push(createEvent(fallbackRemindAt, now));
  }
   return events;
};

// Helpers
function createEvent(remindAt, now) {
  return {
    remind_at: remindAt,
    remind_end: moment(remindAt).add(DEFAULT_DUE_DAYS, 'days').toDate(),
    created_on: now.toDate(),
    updated_on: now.toDate(),
  };
}

function buildDateTime(dateMoment, timeStr) {
  const [hour, minute] = timeStr.split(':').map(Number);
  return moment(dateMoment).set({ hour, minute, second: 0, millisecond: 0 }).toDate();
}

function parseCSV(str) {
  if (!str || typeof str !== 'string') return [];
  return str
    .split(',')
    .map(x => x.trim())
    .filter(x => x !== '')
    .map(Number)
    .filter(x => !isNaN(x));
}

function parseWeekdays(str) {
  const validDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return (str || '')
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(d => validDays.includes(d));
}


async function markMissedReminders (username){
  try {
    const now = new Date();

    const result = await pool.query(`
      UPDATE reminderevents
      SET status = 'Missed', updated_on = $2
      WHERE username = $1
        AND status = 'Upcoming'
        AND remind_at < $2
    `, [username, now]);

    console.log(`Marked ${result.rowCount} reminders as missed for user: ${username}`);
  } catch (err) {
    console.error('Error marking missed reminders:', err);
  }
}
const markReminderAsCompleted = async (id, username) => {
  try {
    await pool.query(`
      UPDATE reminderevents
      SET status = 'Completed', updated_on = NOW()
      WHERE id = $1 AND username = $2
    `, [id, username]);

    console.log(`Reminder ID ${id} marked as Completed.`);
  } catch (err) {
    console.error('Error marking reminder as completed:', err);
  }
};

const snoozeReminder = async (id, username, nextRemindAt) => {
  try {
    const remindAt = moment(nextRemindAt).toDate();
    const remindEnd = moment(remindAt).add(DEFAULT_DUE_DAYS, 'days').toDate();

    await pool.query(`
      UPDATE reminderevents
      SET remind_at = $1,
          remind_end = $2,
          status = 'Upcoming',
          updated_on = NOW()
      WHERE id = $3 AND username = $4
    `, [remindAt, remindEnd, id, username]);

    console.log(`Reminder ID ${id} snoozed to ${remindAt}`);
  } catch (err) {
    console.error('Error snoozing reminder:', err);
  }
};

const revertToReminder = async (id, username, newRemindAt) => {
  try {
    const remindAt = moment(newRemindAt).toDate();
    const remindEnd = moment(remindAt).add(DEFAULT_DUE_DAYS, 'days').toDate();

    await pool.query(`
      UPDATE reminderevents
      SET remind_at = $1,
          remind_end = $2,
          status = 'Upcoming',
          updated_on = NOW()
      WHERE id = $3 AND username = $4
    `, [remindAt, remindEnd, id, username]);

    console.log(`Reminder ID ${id} reverted to Upcoming for ${remindAt}`);
  } catch (err) {
    console.error('Error reverting reminder:', err);
  }
};
const getUpcomingReminders = async (username, moduleName) => {
  try {
    const result = await pool.query(`
      SELECT * FROM reminderevents
      WHERE username = $1
        AND module_name = $2
        AND status = 'Upcoming'
      ORDER BY remind_at ASC
    `, [username, moduleName]);

    return result.rows;
  } catch (err) {
    console.error('Error fetching upcoming reminders:', err);
    return [];
  }
};
const getMissedReminders = async (username, moduleName) => {
  try {
    const result = await pool.query(`
      SELECT * FROM reminderevents
      WHERE username = $1
        AND module_name = $2
        AND status = 'Missed'
      ORDER BY remind_at DESC
    `, [username, moduleName]);

    return result.rows;
  } catch (err) {
    console.error('Error fetching missed reminders:', err);
    return [];
  }
};


module.exports = { onAppLaunch };
