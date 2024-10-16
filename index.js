// Import dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bot = require('./services/botService');
const { sendRandomMessage } = require('./services/messageService');
const { scheduleDailyMessage } = require('./services/scheduleService');
const webhookRoutes = require('./routes/webhook');
const User = require('./models/user');

// Set up the Express app to handle webhooks
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const mongo = process.env.MONGO_URI;
mongoose.connect(mongo).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Middlewares
app.use(express.json());

// Use webhook routes
app.use('/', webhookRoutes);

// Start command - personalized welcome
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
  
    let user = await User.findOne({ userId: chatId });
    if (!user) {
            // If the user doesn't exist, create a new user object and save it to the database
            user = new User({
                userId: chatId,
                username: username,
                isNewUser: true,       // Mark this user as new
                dailyTime: null,   // No daily message set yet
                feedback: ''       // No feedback yet
            });
            
            // Save the new user to MongoDB
            await user.save();

        bot.sendMessage(chatId, `Welcome ${username}! I'm here to uplift your spirit. I will share daily inspiration and help you stay motivated, strong, and peaceful.\n\n` +
            `- /start: Start interacting with me!\n` +
            `- /set_daily: Schedule daily messages at a time that works for you.\n` +
            `- /stop_daily: Stop receiving messages.\n` +
            `- /feedback: Share your feedback anytime!\n` +
            `Choose an option from the menu below to receive a message.`);
        bot.sendMessage(chatId, `Welcome back ${username}! How can I help you today?`);
    }

    showMenu(chatId);
});

// Inline buttons for categories
function showMenu(chatId) {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Strength 💪', callback_data: 'strength' }],
                [{ text: 'Motivation ✨', callback_data: 'motivation' }],
                [{ text: 'Peace ☮️', callback_data: 'peace' }],
                [{ text: 'Give Feedback', callback_data: 'feedback' }]
            ],
        },
    };
    bot.sendMessage(chatId, 'Choose a category:', options);
}

// Handle button click
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'feedback') {
        bot.sendMessage(chatId, 'Please send your feedback:');
        bot.once('message', async (msg) => {
            const feedback = msg.text;
            await User.findOneAndUpdate({ userId: chatId }, { feedback });
            bot.sendMessage(chatId, 'Thank you for your feedback!');
        });
    } else {
        sendRandomMessage(chatId, data);
    }
});

// Set daily message
bot.onText(/\/set_daily/, async (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Please enter the time for daily messages in HH:MM format:');
    bot.once('message', async (msg) => {
        const time = msg.text;
        await User.findOneAndUpdate({ userId: chatId }, { dailyTime: time });
        bot.sendMessage(chatId, `Daily message scheduled at ${time}.`);
        scheduleDailyMessage(chatId, time);
    });
});

// Stop daily message
bot.onText(/\/stop_daily/, async (msg) => {
    const chatId = msg.chat.id;
    await User.findOneAndUpdate({ userId: chatId }, { dailyTime: null });
    bot.sendMessage(chatId, 'Daily messages stopped.');
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
