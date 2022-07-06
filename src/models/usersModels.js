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
    db.query('UPDATE users SET email=$1, username=$2, phone=$3, bio=$4, short_name=$5 WHERE id=$6', [email, username, phone, bio, shortName, id], (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  }),
  updatePhoto: (data) => new Promise((resolve, reject) => {
    const { id, photo } = data
    db.query('UPDATE users SET photo=$1 WHERE id=$2', [photo, id], (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
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
