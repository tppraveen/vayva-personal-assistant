// In-memory state
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

// 🔧 MOCK insert function (replace with your actual function)
const insertEvent = async ({ title, desc, from, to }) => {
  return { success: true };
};

/**
 * Main handler for all messages
 */
const handleBotMessage = async (chatId, text) => {
  const state = getState(chatId);

  if (/^hi p bot$/i.test(text)) {
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
👋 Hi! I’m your personal assistant for expenses, reminders, and calendar tasks.

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

const handleReminderMenu = (chatId, text) => {
  switch (text) {
    case '1':
      setState(chatId, { step: 'REMINDER_UPCOMING', page: 1 });
      return `
📋 Top 5 Upcoming Reminders:

1. Call Mom – 26 June at 6:00 PM
2. Team meeting – 27 June at 10:00 AM
3. Pay rent – 1 July at 9:00 AM
4. Dentist appointment – 2 July at 3:00 PM
5. Submit report – 3 July at 11:59 PM

What would you like to do next?

1. ▶️ Show next 5
2. ❌ Exit
      `.trim();

    case '2':
      return `⏰ You have no missed reminders.`;

    case '3':
      setState(chatId, { step: 'ADD_REMINDER_FROM', reminder: {} });
      return `📅 When should I remind you from time?\n(Reply with date format: DD-MM-YYYY HH:MM or keywords like "tomorrow", "today")`;

    default:
      return `❌ Please reply with 1, 2, or 3.`;
  }
};

const handleUpcomingReminders = (chatId, text) => {
  if (text === '1') {
    return `
📋 Next 5 Reminders:

6. Yoga class – 4 July at 6:00 AM
7. Grocery shopping – 4 July at 7:00 PM
8. Review meeting – 5 July at 3:00 PM
9. Dinner with family – 6 July at 8:00 PM
10. Book reading – 7 July at 9:00 AM

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

  const confirmMsg = `
📋 Confirm this reminder:

🗓 From: ${reminder.from}
🛑 To: ${reminder.to}
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
      const response = await insertEvent(state.reminder);
      if (response.success) {
        setState(chatId, { step: 'MAIN_MENU' });
        return `
✅ Reminder created successfully!

Return to:
1. Main Menu
2. Add Another Reminder
        `.trim();
      } else {
        return `❌ Failed to create reminder. Try again later.`;
      }
    } catch (err) {
      return `❌ Error creating reminder: ${err.message}`;
    }
  }

  if (text.toLowerCase() === 'no') {
    return showMainMenu(chatId);
  }

  return `❓ Please reply "yes" to confirm or "no" to cancel.`;
};

module.exports = { handleBotMessage };
