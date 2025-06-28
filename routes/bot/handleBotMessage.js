
const pool = require('../../db');
const axios = require('axios');

// // In-memory state
const userStateMap = {}; 

/**
 * Get user state
 */
const getState = (chatId) => userStateMap[chatId] || {};

/**
 * Set user state
 */
const setState = (chatId, state) => {
  userStateMap[chatId] = state;
};

 


/**
 * Main handler for all messages
 */
const handleBotMessage = async (chatId, text) => {
  const state = getState(chatId);

  if (/^hi p bot$/i.test(text) || /^hi$/i.test(text)) {
    return showMainMenu(chatId);
  }

  switch (state.step) {
    case 'MAIN_MENU':
      return handleMainMenu(chatId, text);

    case 'REMINDER_MENU':
      return handleReminderMenu(chatId, text);

    case 'REMINDER_UPCOMING':
      return handleUpcomingReminders(chatId, text);

    case 'ADD_REMINDER_FROM':
      return handleAddReminderFrom(chatId, text);

    case 'ADD_REMINDER_TO':
      return handleAddReminderTo(chatId, text);

    case 'ADD_REMINDER_TITLE':
      return handleAddReminderTitle(chatId, text);

    case 'ADD_REMINDER_DESC':
      return handleAddReminderDesc(chatId, text);

    case 'ADD_REMINDER_CONFIRM':
      return handleAddReminderConfirm(chatId, text, state);

    default:
      return `🤖 Sorry, I didn’t understand that. Try sending "Hi P Bot" to start.`;
  }
};

//
// ─── STEP HANDLERS ───────────────────────────────────────────
//

const showMainMenu = (chatId) => {
  setState(chatId, { step: 'MAIN_MENU' });

  return `
👋 Hi! I’m your P-Bot Personal assistant for expenses, reminders, and calendar tasks.

Here’s what I can do:
1. 🧠 Reminder
2. 💸 Expenses
3. 💊 Medicine

Reply with the number (1-3) to continue.
  `.trim();
};

const handleMainMenu = (chatId, text) => {
  switch (text) {
    case '1':
      setState(chatId, { step: 'REMINDER_MENU' });
      return `
🧠 Reminder Menu:
1. 📅 View upcoming reminders
2. ⏰ View missed reminders
3. ➕ Add a reminder

Reply with the number (1-3).
      `.trim();

    case '2':
      return `💸 Expenses section coming soon!`;

    case '3':
      return `💊 Medicine section coming soon!`;

    default:
      return `❌ Please reply with a number between 1-3.`;
  }
};

const moment = require('moment-timezone');

const handleReminderMenu = async (chatId, text) => {
  switch (text) {
    case '1':
      try {
        const oPayload = {
          username: 'praveen',limit :5,offset:1
        };
        const top5Calenders = await getTop5CalendarEventsAsText(oPayload);
  
        if (top5Calenders.length === 0) {
          return `📋 No upcoming reminders found.`;
        }
 
        setState(chatId, { step: 'REMINDER_UPCOMING', page: 1 });

        return `
📋 Top 5 Upcoming Reminders:

${top5Calenders}

What would you like to do next?

1. ▶️ Show next 5
2. ❌ Exit
        `.trim();

      } catch (err) {
        console.error('Error fetching reminders:', err);
        return `❌ Could not fetch reminders. Please try again later.`;
      }

    case '2':
      return `⏰ You have no missed reminders.`;

    case '3':
      setState(chatId, { step: 'ADD_REMINDER_FROM', reminder: {} });
      return `📅 When should I remind you from time?\n(Reply with date format: DD-MM-YYYY HH:MM or keywords like "tomorrow", "today")`;

    default:
      return `❌ Please reply with 1, 2, or 3.`;
  }
};



const handleUpcomingReminders = async (chatId, text) => {
  if (text === '1') {
     const oPayload = {
          username: 'praveen',limit :5,offset:5
        };
        const topnext5Calenders = await getTop5CalendarEventsAsText(oPayload);
  
        if (topnext5Calenders.length === 0) {
          return `📋 No upcoming reminders found.`;
        }

    return `
📋 Next 5 Reminders:

${topnext5Calenders}

What would you like to do next?

1. ▶️ Show next 5
2. ❌ Exit
    `.trim();
  }

  if (text === '2') {
    return showMainMenu(chatId);
  }

  return `❌ Please reply with 1 or 2.`;
};

//
// ─── ADD REMINDER FLOW ─────────────────────────────────────
//

const handleAddReminderFrom = (chatId, text) => {
  const state = getState(chatId);
  const reminder = { ...state.reminder, from: text };
  setState(chatId, { step: 'ADD_REMINDER_TO', reminder });
  return `📅 When should the reminder end?\n(Reply with date format: DD-MM-YYYY HH:MM or keywords like "tomorrow", "today")`;
};

const handleAddReminderTo = (chatId, text) => {
  const state = getState(chatId);
  const reminder = { ...state.reminder, to: text };
  setState(chatId, { step: 'ADD_REMINDER_TITLE', reminder });
  return `✏️ What is the title of the reminder?`;
};

const handleAddReminderTitle = (chatId, text) => {
  const state = getState(chatId);
  const reminder = { ...state.reminder, title: text };
  setState(chatId, { step: 'ADD_REMINDER_DESC', reminder });
  return `📝 Please enter a short description (or "skip")`;
};

const handleAddReminderDesc = (chatId, text) => {
  const state = getState(chatId);
  const reminder = { ...state.reminder, desc: text === 'skip' ? '' : text };
  const fromDateTime = parseToISTDateTime(reminder.from);
const toDateTime = parseToISTDateTime(reminder.to);

  const confirmMsg = `
📋 Confirm this reminder:

🗓 From: ${fromDateTime}
🛑 To: ${toDateTime}
📌 Title: ${reminder.title}
📝 Description: ${reminder.desc || '(none)'}

Reply:
✅ "yes" to create
❌ "no" to cancel and return to main menu
  `.trim();

  setState(chatId, { step: 'ADD_REMINDER_CONFIRM', reminder });

  return confirmMsg;
};

const handleAddReminderConfirm = async (chatId, text, state) => {
  if (text.toLowerCase() === 'yes') {
    try {
        const fromDateTime = parseToISTDateTime(state.reminder.from);
const toDateTime = parseToISTDateTime(state.reminder.to);

if (!fromDateTime || !toDateTime) {
  return `❌ Invalid date/time format. Please try again using "DD-MM-YYYY HH:MM" or natural terms like "tomorrow 10:00".`;
}

const payload = {
  title: state.reminder.title,
  description: state.reminder.desc || '',
  fromDateTime:new Date(fromDateTime).toISOString(),
  toDateTime:new Date(toDateTime).toISOString(),
  username: 'praveen',
  type: 'Type07',
  icon: 'sap-icon://appointment-2'
};

const response = await insertCalenderEventstoDB(payload); // send as array

return response+`


Return to:
1. Main Menu
2. Add Another Reminder
        `.trim();

//       if (response.success) {
//         setState(chatId, { step: 'MAIN_MENU' });
//         return `
// ✅ Reminder created successfully!

// Return to:
// 1. Main Menu
// 2. Add Another Reminder
//         `.trim();
//       } else {
//         return `❌ Failed to create reminder. Try again later.`;
//       }
    } catch (err) {
      return `❌ Error creating reminder: ${err.message}`;
    }
  }

  if (text.toLowerCase() === 'no') {
    return showMainMenu(chatId);
  }

  return `❓ Please reply "yes" to confirm or "no" to cancel.`;
};















/**
 * Convert input like 'tomorrow 10:00' or 'monday 9:30' into IST datetime
 */
const parseToISTDateTime = (input) => {
  const now = moment().tz("Asia/Kolkata");

  let date;
  const lower = input.toLowerCase();

  if (lower.startsWith("tomorrow")) {
    date = now.clone().add(1, 'day');
    input = input.replace(/tomorrow/i, '').trim();
  } else if (lower.startsWith("today")) {
    date = now.clone();
    input = input.replace(/today/i, '').trim();
  } else {
    // Try parsing weekdays
    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (let i = 0; i < 7; i++) {
      if (lower.startsWith(weekdays[i])) {
        const targetDay = i;
        const currentDay = now.day();
        const daysToAdd = (targetDay + 7 - currentDay) % 7 || 7;
        date = now.clone().add(daysToAdd, 'day');
        input = input.replace(new RegExp(weekdays[i], 'i'), '').trim();
        break;
      }
    }
  }

  if (!date) {
    // fallback to manual date like 26-06-2025 10:00
    date = moment.tz(input, "DD-MM-YYYY HH:mm", "Asia/Kolkata");
  } else {
    // Add time (HH:mm)
    const timeMatch = input.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const [_, hour, minute] = timeMatch;
      date.hour(Number(hour)).minute(Number(minute)).second(0);
    } else {
      // default time
      date.hour(9).minute(0).second(0);
    }
  }

  if (!date.isValid()) {
    return null;
  }

  return date.format(); // ISO with +05:30
};
 
/**
 * Insert a single event into the calenderEvents table
 */

// Replace with your actual host (localhost or deployed domain)
const CALENDAR_API_BASE_URL = process.env.API_BASE_URL ;
const insertEventsViaApi = async (payload) => {
  try {
    const response = await axios.post(
      CALENDAR_API_BASE_URL+`/oData/v1/CalenderService/insertEvents`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      console.log("📅 Reminder inserted successfully.");
      return response.data;
    } else {
      console.log(`Unexpected Insert response: ${response.status}`);
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Failed to insert reminder:", error.response?.data || error.message);
    throw error;
  }
};

 
const insertCalenderEventstoDB = async (event) => {
  try {
     const { title,description,fromDateTime,toDateTime,username,type,icon} = event;

    const query = `
      INSERT INTO dummytable (id, name)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [123, fromDateTime];
  const result = await pool.query(query, values);
    return "Inserted into Calender Successfully.";
  } catch (error) {
    
    console.error("DB Insert Error:", error);
    // throw error;
    return "DB Error : Not Inserted into Calender.";

  }
}; 
const getISTTimeFormat = (startdate)=>{
 

// Create a Date object in UTC
const date = new Date(startdate);

// Convert to IST (UTC+5:30)
const istOffset = 5.5 * 60 * 60 * 1000; // milliseconds
const istDate = new Date(date.getTime() + istOffset);

// Format as dd/mm/yyyy HH MM
const dd = String(istDate.getDate()).padStart(2, '0');
const mm = String(istDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const yyyy = istDate.getFullYear();
const HH = String(istDate.getHours()).padStart(2, '0');
const MM = String(istDate.getMinutes()).padStart(2, '0');

return formatted = `${dd}/${mm}/${yyyy} ${HH}:${MM}`;



};
const getTop5CalendarEventsAsText = async (requests) => {
  const { username,limit,offset} = requests;

  try {
    const query = `
      SELECT *
      FROM calenderevents  where username=$1
      ORDER BY startdate DESC 
      LIMIT $2 OFFSET $3;
    `;
    const values =[username,limit,offset]
    const result = await pool.query(query,values);

    if (result.rows.length === 0) {
      return "No calendar events found.";
    }
 
    const formattedText = result.rows
      .map((row, index) => `${index + offset+1}. ${row.title}:${row.description} - ${getISTTimeFormat(row.startdate)}-${getISTTimeFormat(row.enddate)} `)
      .join('\n');

    return result.rows[0];

  } catch (error) {
    console.error("DB Fetch Error:", error);
    return "DB Error: Could not retrieve calendar events.";
  }
};







 
module.exports = { handleBotMessage };
