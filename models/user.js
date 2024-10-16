const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: Number,
    username: String,
    isNewUser: Boolean,
    dailyTime: String, // HH:MM format
    feedback: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
