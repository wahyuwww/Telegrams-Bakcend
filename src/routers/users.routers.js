const express = require('express')
const {
  getUsers, getDetailUsers, updateUsers, updatePhoto, deleteUsers
} = require('../controllers/usersController')
// const jwtAuth = require('../middleware/jwtAuth')
const upload = require('../middleware/upload')
const protect = require('../middleware/auth')

const router = express.Router()

router
  .get('/users', protect, getUsers)
  .get('/users/:id', getDetailUsers)
  .put('/users', protect, updateUsers)
  .put('/photo', protect, upload, updatePhoto)
  .delete('/users', protect, deleteUsers)

module.exports = router
