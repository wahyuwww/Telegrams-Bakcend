require('dotenv').config()

module.exports = {
  PORT: process.env.PORT,

  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  NODE_ENV: process.env.NODE_ENV,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
}
