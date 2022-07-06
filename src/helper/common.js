// const createHttpError = require('http-errors')
const response = (res, result, message, status, pagination, token = false) => {
  const resultRespon = {}
  resultRespon.status = 'success'
  resultRespon.statusCode = status || 200
  resultRespon.message = message || null
  resultRespon.data = result
  if (pagination) resultRespon.pagination = pagination
  if (token) {
    resultRespon.token = token
  }
  res.status(status).json(resultRespon)
}

const failed = (res, data) => {
  const { code, payload, message } = data
  const responData = {
    code,
    status: 'failed',
    message,
    error: payload
  }
  res.status(code).json(responData)
}

const responnotdata = (req, res, data) => {
  // const id = req.params.id
  console.log(data === undefined)
  if (data === undefined) {
    res.json({
      msg: 'data not found'
    })
    // next(createHttpError(400, 'token invalid'))
  }
}

module.exports = {
  response,
  responnotdata,
  failed
}
