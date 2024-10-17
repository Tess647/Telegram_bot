const cron = require('node-cron');
const User = require('../models/user');
const { sendRandomMessage } = require('./messageService');

function scheduleDailyMessage(chatId, time) {
    const [hour, minute] = time.split(':');
    console.log(`Scheduling daily message for user ${chatId} at ${time}`);
    cron.schedule(`${minute} ${hour} * * *`, async () => {
        const user = await User.findOne({ userId: chatId });
        console.log(`Fetched user for scheduled message: ${user}`);
        if (user && user.dailyTime) {
            const randomCategory = Object.keys(messages)[Math.floor(Math.random() * 3)];
            console.log(`Sending random message from category: ${randomCategory}`);
            sendRandomMessage(chatId, randomCategory);
        } else {
            console.log(`No user found or dailyTime not set for user ${chatId}`);
        }
    });
}

module.exports = { scheduleDailyMessage };
