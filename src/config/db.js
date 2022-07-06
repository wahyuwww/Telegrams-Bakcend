const { Pool } = require('pg')
const {
  DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
} = require('../helper/connectEnv')

const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT
  // ssl: {
  //   rejectUnauthorized: false
  // }
}

const db = new Pool(config)

module.exports = db
