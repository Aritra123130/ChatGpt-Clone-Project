const express = require('express');
const authMiddlewire = require('../middlewires/auth.middlewire')
const router = express.Router();
const chatController = require('../controller/chat.controller')

router.post('/',authMiddlewire.authuser,chatController.createChat)

/* GET /api/chat/ */
router.get('/', authMiddlewire.authuser, chatController.getChats)


/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddlewire.authuser, chatController.getMessages)
module.exports = router;