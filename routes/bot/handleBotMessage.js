// bot/handleBotMessage.js

const userStateMap = {}; // Simple in-memory state tracking

// Replace with your actual sendMessage implementation
const sendMessage = async (chatId, message) => {
  console.log(`Sending to ${chatId}: ${message}`);
  // Call Telegram Bot API here
};

const handleBotMessage = async (chatId, text) => {
  const userState = userStateMap[chatId] || {};

  switch (true) {
    case /^hi p bot$/i.test(text):
      userStateMap[chatId] = { step: 'MAIN_MENU' };
      return sendMessage(chatId, `
👋 Hi! I’m your personal assistant for expenses, reminders, and calendar tasks.

Here’s what I can do:
1. 🧠 Reminder
2. 💸 Expenses
3. 💊 Medicine

Reply with the number (1-3) to continue.
      `.trim());

    case userState.step === 'MAIN_MENU' && text === '1':
      userStateMap[chatId] = { step: 'REMINDER_MENU' };
      return sendMessage(chatId, `
🧠 Reminder Menu:
1. 📅 View upcoming reminders
2. ⏰ View missed reminders
3. ➕ Add a reminder

Reply with the number (1-3).
      `.trim());

    case userState.step === 'REMINDER_MENU' && text === '1':
      userStateMap[chatId] = { step: 'REMINDER_UPCOMING', page: 1 };
      return sendMessage(chatId, `
📋 Top 5 Upcoming Reminders:

1. Call Mom – 26 June at 6:00 PM
2. Team meeting – 27 June at 10:00 AM
3. Pay rent – 1 July at 9:00 AM
4. Dentist appointment – 2 July at 3:00 PM
5. Submit report – 3 July at 11:59 PM

What would you like to do next?

1. ▶️ Show next 5
2. ❌ Exit
      `.trim());

    case userState.step === 'REMINDER_UPCOMING' && text === '1':
      userStateMap[chatId].page = 2;
      return sendMessage(chatId, `
📋 Next 5 Reminders:

6. Yoga class – 4 July at 6:00 AM
7. Grocery shopping – 4 July at 7:00 PM
8. Review meeting – 5 July at 3:00 PM
9. Dinner with family – 6 July at 8:00 PM
10. Book reading – 7 July at 9:00 AM

What would you like to do next?

1. ▶️ Show next 5
2. ❌ Exit
      `.trim());

    case userState.step === 'REMINDER_UPCOMING' && text === '2':
      userStateMap[chatId] = { step: 'MAIN_MENU' };
      return sendMessage(chatId, `
✅ Returning to main menu...

1. 🧠 Reminder
2. 💸 Expenses
3. 💊 Medicine

Reply with the number (1-3).
      `.trim());

    default:
      return sendMessage(chatId, `🤖 Sorry, I didn’t get that. Try sending "Hi P Bot" to start.`);
  }
};

module.exports = { handleBotMessage };
