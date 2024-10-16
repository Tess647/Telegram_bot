// Import dependencies
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const cron = require('node-cron');
const express = require('express');

// Set up the Express app to handle webhooks
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const UserSchema = new mongoose.Schema({
  userId: Number,
  username: String,
  isNew: Boolean,
  dailyTime: String, // HH:MM format
  feedback: String,
});
const User = mongoose.model('User', UserSchema);

// Telegram Bot Token
const token = process.env.TELEGRAM_TOKEN;

// Create a bot that uses polling
const bot = new TelegramBot(token, { polling: true });

// Helper function to send random message from a category
const messages = {
  strength: ["You are strong!", "Keep pushing forward!", "Strength lies within you!"],
  motivation: ["Stay motivated!", "You can achieve anything!", "Don't give up!"],
  peace: ["Find peace within.", "Stay calm and carry on.", "Breathe and relax."],
};

async function sendRandomMessage(chatId, category) {
  const categoryMessages = messages[category];
  const message = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
  
  // Fetch the user from the database to get their username
  const user = await User.findOne({ userId: chatId });
  const username = user ? user.username : 'there'; // Default to 'there' if username isn't found
  
  // Send a message with the user's name followed by the random message
  bot.sendMessage(chatId, `${username}, ${message}`);
}


// Start command - personalized welcome
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  
  let user = await User.findOne({ userId: chatId });
  if (!user) {
    user = new User({ userId: chatId, username, isNew: true });
    await user.save();
    bot.sendMessage(chatId, `Welcome ${username}! I'm here to uplift your spirit. I'm here to share daily inspiration and help you stay motivated, strong, and peaceful.\n\n"
                "- /start: Start interacting with me!\n"
                "- /set_daily: Schedule daily messages at a time that works for you.\n"
                "- /stop_daily: Stop receiving messages.\n"
                "- /feedback: Share your feedback anytime!\n"
                "Choose an option from the menu below to receive a message."`);
  } else {
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

// Schedule daily message with cron
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

// Webhook setup for Heroku
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
