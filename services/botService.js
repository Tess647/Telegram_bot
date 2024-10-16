require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
console.log(token);

// Create a bot that uses polling
const bot = new TelegramBot(token, { polling: true });

module.exports = bot;
