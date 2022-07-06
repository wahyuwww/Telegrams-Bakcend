/* eslint-disable camelcase */
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const db = require('../config/db')

const authModel = {
  checkEmailRegistered: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT COUNT(*) FROM users WHERE email=$1',
        [email],
        (err, result) => {
          if (err) {
            reject(err)
          } else if (result.rows[0].count > 0) {
            reject(new Error('Email already registered!'))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  FindEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email=$1', [email], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  getProfil: (idcompany) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM company WHERE idcompany = $1',
        [idcompany],
        (err, result) => {
          if (!err) {
            resolve(result.rows)
          } else {
            reject(new Error(err))
          }
        }
      )
    })
  },
  create: ({ email, password, fullname }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (email, password, fullname) VALUES ($1, $2, $3)',
        [email, password, fullname],
        (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(new Error('data error disini'))
          }
        }
      )
    })
  },
  activasi: ({ active = '1', email }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE company SET active = $1 where email = $2',
        [active, email],
        (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(new Error('data error disini'))
          }
        }
      )
    })
  },
  updateProfil: ({
    fullname,
    password,
    company,
    phonenumber,
    position,
    email,
    companyfield,
    address,
    companydescription,
    image,
    instagram,
    linkedin,
    idcompany
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE company SET fullname = COALESCE($1,fullname), 
        password = COALESCE($2,password),
        company = COALESCE($3,company), 
        phonenumber = COALESCE($4,phonenumber), 
        position = COALESCE($5,position),
        email = COALESCE($6,email),
        companyfield = COALESCE($7,companyfield),
        address = COALESCE($8,address),
        companydescription = COALESCE($9,companydescription),
        image = COALESCE($10,image),
        instagram = COALESCE($11,instagram),
        linkedin = COALESCE($12,linkedin)
         WHERE idcompany = $13`,
        [
          fullname,
          password,
          company,
          phonenumber,
          position,
          email,
          companyfield,
          address,
          companydescription,
          image,
          instagram,
          linkedin,
          idcompany
        ],
        (err, result) => {
          if (!err) {
            resolve(result.rows)
          } else {
            reject(new Error(err))
          }
        }
      )
    })
  },
  changePassword: (body) => {
    return new Promise((resolve, reject) => {
      const qs = 'SELECT email FROM company WHERE idCompany = $1'
      db.query(qs, [body.idCompany], (_err, data) => {
        console.log(data)
        if (!data.rows[0]) {
          bcrypt.genSalt(10, (_err, salt) => {
            if (_err) {
              reject(_err)
            }
            const { password, email } = body

            bcrypt.hash(password, salt, (err, hashedPassword) => {
              if (err) {
                reject(err)
              }
              const queryString =
                'UPDATE company SET password= $1 WHERE email = $2'
              db.query(queryString, [hashedPassword, email], (err, data) => {
                if (!err) {
                  resolve({ msg: 'change password success' })
                } else {
                  reject(err)
                }
              })
            })
          })
        } else {
          reject(_err)
        }
      })
    })
  }
}

module.exports = {
  authModel
}
