const express = require('express')
const Router = express.Router()

const authRoute = require('./auth.routers')
const usersRoute = require('./users.routers')
const chatsMesagge = require('./chats.routers')

Router.use('/auth', authRoute).use('/', usersRoute).use('/chats', chatsMesagge)
module.exports = Router
