const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('telegram_bot_db');
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Check or add user
const checkOrAddUser = async (userId, firstName) => {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ user_id: userId });

    if (!user) {
        await usersCollection.insertOne({ user_id: userId, first_name: firstName });
        return false; // new user
    }
    return true; // existing user
};

// Store user feedback
const storeUserFeedback = async (userId, feedbackType, message) => {
    const feedbackCollection = db.collection('feedback');
    await feedbackCollection.insertOne({
        user_id: userId,
        feedback_type: feedbackType,
        message: message,
        timestamp: new Date()
    });
};

module.exports = {
    checkOrAddUser,
    storeUserFeedback
};
