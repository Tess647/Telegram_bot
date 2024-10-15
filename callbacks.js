const { storeUserFeedback } = require('./database');
const messages = require('./messages');

// Handle button clicks
const handleMessageType = async (query, bot) => {
    const category = query.data;

    if (category === 'feedback') {
        await bot.sendMessage(query.message.chat.id, "Please type your feedback. How can I improve?");
    } else if (messages[category]) {
        await bot.sendMessage(query.message.chat.id, getRandomMessage(category));  // Assuming getRandomMessage gets a message based on the category
    }

    await bot.answerCallbackQuery(query.id);  // Acknowledge the callback query
};

// Handle user feedback
const handleFeedback = async (msg, bot) => {
    const userId = msg.from.id;
    const feedback = msg.text;

    await storeUserFeedback(userId, 'user_feedback', feedback);
    await bot.sendMessage(msg.chat.id, "Thank you for your feedback!");
};

module.exports = {
    handleMessageType,
    handleFeedback
};
