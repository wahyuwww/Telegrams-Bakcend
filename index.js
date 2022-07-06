// const dotenv = require('dotenv')
// dotenv.config()
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
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
  })
)
app.use(xss())
app.use(cors())
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

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`running di ${PORT}`)
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
