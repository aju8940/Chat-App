const express = require('express')
const router = express.Router()
const messageController = require('../Controllers/messageController')

router.route('/').post(messageController.createMessage)
router.route('/:id').get(messageController.getMessages)


module.exports = router