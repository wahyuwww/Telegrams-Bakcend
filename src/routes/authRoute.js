const express = require('express')
const router = express.Router()
// const upload = require('../middlewares/uploadFile')
const { authController } = require('../controller/authController')

router
  .post("/register", authController.registerCompany)
  .post("/login", authController.login);

module.exports = router
