const { checkOrAddUser } = require('./database');

// Welcome message utility
const getWelcomeMessage = (firstName, isNewUser) => {
    if (isNewUser) {
        return `Welcome ${firstName}! I'm here to share daily inspiration and help you stay motivated, strong, and peaceful.\n\n` +
               `- /start: Start interacting with me!\n` +
               `- /set_daily: Schedule daily messages at a time that works for you.\n` +
               `- /stop_daily: Stop receiving messages.\n` +
               `- /feedback: Share your feedback anytime!\n` +
               `Choose an option from the menu below.`;
    } else {
        return `Welcome back, ${firstName}!\nJust a reminder:\n` +
               `- /set_daily: Schedule daily messages.\n` +
               `- /stop_daily: Stop messages.\n` +
               `- /feedback: Share feedback.\n` +
               `Choose an option from the menu below.`;
    }
};

// /start command
const sendWelcomeMessage = async (msg, bot) => {
    const userId = msg.from.id;
    const firstName = msg.from.first_name;
    const isNewUser = !await checkOrAddUser(userId, firstName);

    const welcomeMessage = getWelcomeMessage(firstName, isNewUser);
    await bot.sendMessage(msg.chat.id, welcomeMessage);
    await sendMessageMenu(msg.chat.id, bot);
};

// Send menu with inline buttons
const sendMessageMenu = async (chatId, bot) => {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Strength 💪', callback_data: 'strength' }],
                [{ text: 'Motivation ✨', callback_data: 'motivation' }],
                [{ text: 'Peace ☮️', callback_data: 'peace' }],
                [{ text: 'Give Feedback', callback_data: 'feedback' }]
            ]
        }
    };
    await bot.sendMessage(chatId, "What do you need today?", options);
};

module.exports = {
    sendWelcomeMessage,
    sendMessageMenu
};
