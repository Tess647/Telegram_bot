const cron = require('node-cron');
const User = require('../models/user');
const { sendRandomMessage } = require('./messageService');

function scheduleDailyMessage(chatId, time) {
    const [hour, minute] = time.split(':');
    cron.schedule(`${minute} ${hour} * * *`, async () => {
        const user = await User.findOne({ userId: chatId });
        if (user && user.dailyTime) {
            const randomCategory = Object.keys(messages)[Math.floor(Math.random() * 3)];
            sendRandomMessage(chatId, randomCategory);
        }
    });
}

module.exports = { scheduleDailyMessage };
