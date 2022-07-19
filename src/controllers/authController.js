const bcrypt = require('bcrypt')
const { v4: uuidV4 } = require('uuid')
// const jwtToken = require('../utils/generateJwtToken')
const authHelper = require('../helper/auth')
const { response, failed } = require('../helper/common')
const authModels = require('../models/authModels')
const createError = require('http-errors')
const salt = 10

module.exports = {
  register: async (req, res, next) => {
    try {
      const user = await authModels.login(req.body.email)
      if (user.rowCount) {
        failed(res, {
          code: 400,
          payload: 'Email already exist!',
          message: 'Register failed!'
        })
        return
      }
      const password = await bcrypt.hash(req.body.password, salt)
      const data = {
        id: uuidV4(),
        ...req.body,
        password
      }
      await authModels.register(data)

      response(res, data, 'Register Success', 200)
    } catch (error) {
      console.log(error)
      next(createError)
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw Error('All field must be filled')
      }
      const {
        rows: [user]
      } = await authModels.login(email)

      if (!user) {
        return res.json({
          message: 'data yang anda inputkan salah'
        })
      }
      const invalidPassword = bcrypt.compareSync(password, user.password)
      // console.log(password)
      if (!invalidPassword) {
        return res.json({
          message: ' data yang anda inputkan salah'
        })
      }
      if (user.active === '0') {
        return res.json({
          message: ' anda belum verifikasi'
        })
      }
      delete user.password
      const payload = {
        email: user.email,
        id: user.id,
        username: user.username
      }
      const tokens = authHelper.generateToken(payload)
      const newRefreshToken = await authHelper.generateRefreshToken(payload)
      const data = {
        email,
        id: user.id,
        token: tokens,
        username: user.username,
        refreshToken: newRefreshToken
      }
      console.log(data)
      response(res, data, 'selemat anda berhasil login', 200)
    } catch (error) {
      console.log(error)
      next(createError)
    }
  }
}
