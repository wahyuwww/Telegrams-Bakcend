const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const CreateError = require('http-errors')
const morgan = require('morgan')
const socketController = require('./src/socket')
const Router = require('./src/routers/index')
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
helmet({
  crossOriginResourcePolicy: false
})
app.use(xss())
app.use(cors())
app.disable('x-powered-by')
app.use('/', Router)
app.use('/img', express.static(path.join(__dirname, './public')))

const server = http.createServer(app)

const io = socketio(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  console.log('berhasil terkoneksi')

  socketController(io, socket)
})

const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
  console.log(`example app listening at http://localhost:${PORT}`)
})

app.all('*', (req, res, next) => {
  next(new CreateError.NotFound())
})

app.use((err, req, res, next) => {
  const messError = err.message || 'internal server error'
  const statusCode = err.status || 500

  res.status(statusCode).json({
    message: messError
  })
})
