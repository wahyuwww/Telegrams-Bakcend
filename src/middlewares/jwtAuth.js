
const jwt = require('jsonwebtoken')
const { failed } = require('../helper/response')

module.exports = (req, res, next) => {
  try {
    const { token } = req.headers
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.APP_DATA = { tokenDecoded: decoded }
    next()
  } catch (err) {
    failed(res, {
      code: 400,
      status: 'error',
      message: 'Bad Request',
      error: err.message
    })
  }
}
