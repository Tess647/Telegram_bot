const express = require('express');
const router = express.Router();
const bot = require('../services/botService');

// Webhook route to handle bot updates
router.post(`/bot${process.env.TELEGRAM_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

module.exports = router;
