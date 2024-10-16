const User = require('../models/user');
const bot = require('./botService');  // import the bot instance

const messages = {
    strength: ["You are strong!", 
                "Keep pushing forward!", 
                "Strength lies within you!",  
                "You are stronger than you think!",
                "Keep going; you’re doing amazing.",
                "Every storm runs out of rain.",
                "You are more powerful than you realize.",
                "Strength doesn’t come from what you can do; it comes from overcoming the things you thought you couldn’t.",
                "You’ve got this, even on the tough days.",
                "Fall seven times, stand up eight.",
                "Challenges are what make life interesting, and overcoming them is what makes life meaningful.",
                "Don’t let fear decide your future.",
                "Strength grows in the moments when you think you can’t go on but you keep going anyway.",
                "Be a warrior, not a worrier.",
                "Your mind is stronger than any challenge.",
                "The harder you work for something, the greater you’ll feel when you achieve it.",
                "Courage doesn’t always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
                "Tough times don’t last, but tough people do.",
                "You are built to handle the pressure.",
                "Storms make trees take deeper roots.",
                "The pain you feel today will be the strength you feel tomorrow.",
                "The struggle you’re in today is developing the strength you need for tomorrow.",
                "Your only limit is the one you set for yourself.",
                "Never give up on something you really want. It’s difficult to wait, but it’s more difficult to regret.",
                "You have survived 100% of your worst days.",
                "Stay strong. The comeback is always greater than the setback."
            ],
    motivation: ["Stay motivated!", 
                "You can achieve anything!", 
                "Don't give up!",
                "Believe in yourself and your abilities.",
                "Every day is a fresh start.",
                "Dream it, believe it, achieve it!",
                "The only limit to your impact is your imagination and commitment.",
                "Don’t watch the clock; do what it does – keep going.",
                "You don’t have to be great to start, but you have to start to be great.",
                "Start where you are, use what you have, do what you can.",
                "Dream big, work hard, stay focused, and surround yourself with good people.",
                "Success is not final; failure is not fatal. It is the courage to continue that counts.",
                "Push yourself because no one else is going to do it for you.",
                "Great things never come from comfort zones.",
                "The harder the battle, the sweeter the victory.",
                "Don’t stop when you’re tired. Stop when you’re done.",
                "Wake up with determination. Go to bed with satisfaction.",
                "Success is the sum of small efforts, repeated day in and day out.",
                "Your only limit is your mind.",
                "Don’t limit your challenges; challenge your limits.",
                "Believe in yourself and all that you are.",
                "If it doesn’t challenge you, it won’t change you.",
                "Be the energy you want to attract.",
                "The key to success is to focus on goals, not obstacles.",
                "Don’t stop until you’re proud.",
                "Believe you can, and you’re halfway there."
            ],
    peace: ["Find peace within.", 
            "Stay calm and carry on.", 
            "Breathe and relax.",
            "Peace begins with a smile.",
            "A calm mind brings inner strength.",
            "Let go of what you cannot change.",
            "Peace is not the absence of trouble, but the presence of tranquility.",
            "Breathe in peace, exhale worry.",
            "Do not let the behavior of others destroy your inner peace.",
            "Inner peace begins the moment you choose not to allow another person or event to control your emotions.",
            "Wherever you go, bring your own peace.",
            "Peace comes from within. Do not seek it without.",
            "The quieter you become, the more you can hear.",
            "In the midst of movement and chaos, keep stillness inside of you.",
            "Peace is found in the present moment, not in the past or future.",
            "Happiness and peace come from within, not from circumstances.",
            "Nothing can bring you peace but yourself.",
            "True peace is found in letting go.",
            "Find peace in the simple things.",
            "Serenity is not freedom from the storm, but peace amid the storm.",
            "The best weapon against stress is your ability to choose one thought over another.",
            "Let peace be your guide through difficult moments.",
            "The more you practice peace, the more peace will find you.",
            "Tranquility comes when you stop fighting for control.",
            "Your peace is more important than anything else.",
            "Allow peace to flow through your day like a gentle river."
        ],
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