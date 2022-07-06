const express = require('express')
const router = express.Router()
const { userController } = require('../controller/userController')
const jwtAuth = require('../middlewares/jwtAuth')
// const protect = require('../middlewares/auth')
const uploadImg = require('../middlewares/uploadFile')

router
  .get('/list', jwtAuth, userController.listUser)
  .put('/update', jwtAuth, userController.updateProfile)
  .put(
    '/update/photo',
    jwtAuth,
    uploadImg.singleUpload,
    userController.updatePhoto
  )
  .get('/profile', jwtAuth, userController.myProfile)
  .get('/profile/:id', jwtAuth, userController.userProfile)
module.exports = router
