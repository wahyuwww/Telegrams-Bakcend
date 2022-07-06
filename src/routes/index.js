const express = require('express')
const Router = express.Router()

const user = require('./user.route')
const authRoute = require('./authRoute')
Router.use('/auth', authRoute).use('/user', user)
module.exports = Router
