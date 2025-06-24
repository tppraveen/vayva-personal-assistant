// services/telegramService.js


const TELEGRAM_TOKEN = process.env.TEL_TKN_PBOT;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

async function sendMessage(chatId, text) {
    try {
        const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });

        const data = await response.json();

        if (!data.ok) {
            console.error("❌ Telegram API error:", data);
            throw new Error(data.description || "Telegram API error");
        }

        return data;
    } catch (error) {
        console.error("💥 sendMessage failed:", error.message || error);
        throw error;
    }
}

module.exports = {
    sendMessage
};