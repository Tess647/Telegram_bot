const User = require('../models/user');
const bot = require('./botService');  // import the bot instance

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

module.exports = { sendRandomMessage };