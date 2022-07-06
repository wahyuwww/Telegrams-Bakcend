const express = require('express')
const { deleteMessage } = require('../controllers/chats.controller')

const router = express.Router()

router
  .delete('/:id', deleteMessage)

module.exports = router
