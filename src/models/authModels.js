const db = require('../config/db')

module.exports = {
  register: (data) => new Promise((resolve, reject) => {
    const {
      id, email, password, username
    } = data
    db.query('INSERT INTO users (id, email, password, username) VALUES ($1, $2, $3, $4)', [id, email, password, username], (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  }),
  login: (email) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email=$1', [email], (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
