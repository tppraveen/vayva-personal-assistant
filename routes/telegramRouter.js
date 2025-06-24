// routes/TelegramService.js

const { sendMessage } = require("../services/telegramService");

const telegramWebhook = async (req, res) => {
        console.log("📩 Incoming webhook payload:", JSON.stringify(req.body));

    const message = req.body.message;

    if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text;

        console.log(`Received message from chatId ${chatId}: ${text}`);
        await sendMessage(chatId, `PBot: ${text}`);
    }

    res.sendStatus(200);
};

const sendTelegramMessage = async (req, res) => {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
        return res.status(400).json({ error: "chatId and message are required" });
    }

    try {
        const result = await sendMessage(chatId, message);
        res.status(200).json(result);
    } catch (err) {
        console.error("Send Message Error:", err.message || err);
        res.status(500).json({
            error: "Failed to send message",
            details: err.message || "Unknown error"
        });
    }
};

module.exports = {
    sendTelegramMessage,
    telegramWebhook
};
