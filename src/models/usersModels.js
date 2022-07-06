const db = require('../config/db')

module.exports = {
  getUser: (getSearch) => new Promise((resolve, reject) => {
    db.query(`SELECT * FROM users WHERE username ILIKE '%${getSearch}%'`, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  }),
  getDetailUser: (id) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id=$1', [id], (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  }),
  updateUsers: (data) => new Promise((resolve, reject) => {
    const {
      email, username, phone, bio, id, shortName
    } = data
    db.query(
      'UPDATE users SET email = COALESCE($1, email), username = COALESCE($2, username), phone = COALESCE($3, phone), bio = COALESCE($4, bio), short_name = COALESCE($5, short_name) WHERE id=$6',
      [email, username, phone, bio, shortName, id],
      (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      }
    )
  }),
  updatePhoto: (data) => new Promise((resolve, reject) => {
    const { id, photo } = data
    db.query(
      'UPDATE users SET photo = COALESCE($1, photo) WHERE id=$2',
      [photo, id],
      (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      }
    )
  }),
  deleteUser: (id) => new Promise((resolve, reject) => {
    db.query('DELETE FROM users WHERE id=$1', [id], (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
