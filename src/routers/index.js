const express = require('express')
const Router = express.Router()

const auth = require('./auth.routers')
const users = require('./users.routers')
const chats = require('./chats.routers')

Router.use('/auth', auth).use('/', users).use('/chats', chats)
module.exports = Router
