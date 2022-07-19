const usersModels = require('../models/usersModels')
const deleteFile = require('../helper/deleteFile')
// const authHelper = require('../helper/auth')
const { response, failed } = require('../helper/common')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const cloudinary = require('../helper/cloudinary')
// const fs = require('fs')

// const deleteFiles = (path) => {
//   // cek apakah file ada
//   if (fs.existsSync(path)) {
//     // delete file
//     fs.unlinkSync(path)
//   }
// }

module.exports = {
  getUsers: async (req, res, next) => {
    const { search } = req.query
    const getValueSearch = search || ''
    try {
      const users = await usersModels.getUser(getValueSearch)
      response(res, users.rows, 'get all Success', 200)
    } catch (error) {
      next(createError)
    }
  },
  getDetailUsers: async (req, res, next) => {
    try {
      const user = await usersModels.getDetailUser(req.params.id)
      response(res, user.rows[0], 'Get all users success!', 200)
    } catch (error) {
      next(createError)
    }
  },
  updateUsers: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
      const id = decoded.id

      const user = await usersModels.getDetailUser(id)

      if (!user.rowCount) {
        failed(res, {
          code: 400,
          payload: 'User not found!',
          message: 'Update user failed!'
        })
        return
      }

      const data = {
        id,
        ...req.body
      }
      const result = await usersModels.updateUsers(data)
      if (result.rowCount > 0) {
        response(res, data, 'update users success!', 200)
        return
      }

      // failed(res, {
      //   code: 400,
      //   payload: 'anda tidak memiliki akses yaa users!',
      //   message: 'Update users failed!'
      // })
    } catch (error) {
      console.log(error)
      next(createError)
    }
  },
  updatePhotos: async (req, res, next) => {
    try {
      const id = req.APP_DATA.tokenDecoded.id
      // console.log(req.file)
      const gambars = req.file.path
      const ress = await cloudinary.uploader.upload(gambars)
      const photo = ress.url
      const checkPhoto = await usersModels.getDetailUser(id)
      const getPhoto = checkPhoto.rows[0].photo
      if (getPhoto !== 'profile-default.png') {
        deleteFile(`./public/${getPhoto}`)
      }
      usersModels
        .updatePhoto(id, photo)
        .then(() => {
          response(res, photo, 'Profile photo updated successfully', 200)
        })
        .catch((error) => {
          console.log(error)
          next(createError)
        })
    } catch (err) {
      next(createError)
    }
  },
  updatePhoto: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
      const id = decoded.id
      console.log(token)
      const user = await usersModels.getDetailUser(id)
      const gambars = req.file.path
      console.log(gambars)
      const ress = await cloudinary.uploader.upload(gambars)
      const photo = ress.url
      if (!user.rowCount) {
        if (req.file) {
          deleteFile(req.file.path)
        }
        failed(res, {
          code: 400,
          payload: 'User not found!',
          message: 'Update photo failed!'
        })
        return
      }

      if (req.file) {
        if (user.rows[0].photo) {
          deleteFile(`public/${user.rows[0].photo}`)
        }
      }

      const data = {
        id,
        photo
      }
      console.log(photo)
      const result = await usersModels.updatePhoto(data)
      if (!result.rowCount) {
        if (req.file) {
          deleteFile(req.file.path)
        }

        failed(res, {
          code: 400,
          payload: "You don't update this photo!",
          message: 'Update photo failed!'
        })
        return
      }

      response(res, data, 'update photo success!', 200)
    } catch (error) {
      console.log(error)
      next(createError)
    }
  },
  deleteUsers: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
      const id = decoded.id

      const user = await usersModels.getDetailUser(id)

      if (!user.rowCount) {
        failed(res, {
          code: 400,
          payload: 'User not found!',
          message: 'Delete user failed!'
        })
        return
      }

      if (user.rowCount) {
        if (user.rows[0].photo) {
          deleteFile(`public/${user.rows[0].photo}`)
        }
      }

      const result = await usersModels.deleteUser(id)

      response(res, result, 'delete photo success!', 200)
    } catch (error) {
      console.log(error)
      next(createError)
    }
  }
}
