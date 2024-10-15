const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com/${TOKEN}`;

// Initialize bot and set webhook
const bot = new TelegramBot(TOKEN);
bot.setWebHook(WEBHOOK_URL).then(() => {
    console.log(`Webhook set at ${WEBHOOK_URL}`);
}).catch(err => {
    console.error('Failed to set webhook:', err.message);
});

// Handle webhook POST requests
app.post(`/${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
