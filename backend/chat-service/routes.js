const express = require('express');
const chatController = require('./chatController');
const router = express.Router();

router.get('/chat/:sender/:receiver', chatController.getChat);
router.post('/chat', chatController.sendMessage);
router.get('/last-conversations/:username', chatController.getLastConversations);

module.exports = router;
