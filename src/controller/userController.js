const { userModel } = require('../models/userModel')
const createError = require('http-errors')
const common = require('../helper/common')
const cloudinary = require('../helper/cloudinary')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const chatModel = require('../models/chat.model')

// const cloudinaryImageUploadMethod = async (file) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.upload(file, (err, res) => {
//       if (err) return res.status(500).send('upload image error')
//       resolve({
//         res: res.secure_url
//       })
//     })
//   })
// }

const deleteFile = (path) => {
  // cek apakah file ada
  if (fs.existsSync(path)) {
    // delete file
    fs.unlinkSync(path)
  }
}

const userController = {
  listUser: (req, res, next) => {
    try {
      const name = req.query.name || ''
      const id = req.APP_DATA.tokenDecoded.id
      console.log(name)
      userModel
        .listUser(name)
        .then(async (result) => {
          const data = await Promise.all(
            result.rows.map(async (item) => {
              const chat = await chatModel.listChat(id, item.id)
              const unreadChat = await chatModel.unreadChat(id, item.id)
              const lastChat =
                chat.rowCount === 0 ? 'No Chat' : chat.rows[chat.rowCount - 1]
              const obj = {
                user: item,
                lastChat,
                unreadChat: unreadChat.rowCount
              }
              return obj
            })
          )
          common.response(res, data, 'get data list chat', 200)
        })
        .catch((error) => {
          console.log(error)
          next(createError)
        })
    } catch (err) {
      next(createError)
    }
  },
  updateProfile: (req, res, next) => {
    try {
      const { fullname, username, phone, bio } = req.body
      const data = {
        fullname,
        username,
        phone,
        bio
      }
      if (!fullname) {
        throw Error("Field 'Fullname' cannot be empty")
      }
      const id = req.APP_DATA.tokenDecoded.id
      userModel
        .updateProfile(id, fullname, username, phone, bio)
        .then(() => {
          common.response(res, data, 'update data portfolio', 200)
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
      const id = req.APP_DATA.tokenDecoded.id
      // console.log(req.file)
      const gambars = req.file.path
      const ress = await cloudinary.uploader.upload(gambars)
      const photo = ress.url
      const checkPhoto = await userModel.getPhoto(id)
      const getPhoto = checkPhoto.rows[0].photo
      if (getPhoto !== 'profile-default.png') {
        deleteFile(`./public/${getPhoto}`)
      }
      userModel
        .updatePhoto(id, photo)
        .then(() => {
          common.response(
            res,
            photo,
            'Profile photo updated successfully',
            200
          )
        })
        .catch((error) => {
          console.log(error)
          next(createError)
        })
    } catch (err) {
      next(createError)
    }
  },
  myProfile: (req, res, next) => {
    try {
      const id = req.APP_DATA.tokenDecoded.id
      userModel
        .getDetailUser(id)
        .then((result) => {
          if (!result.rowCount) {
            console.log('salah ini')
          } else {
            common.response(
              res,
              result.rows[0],
              'Profile photo updated successfully',
              200
            )
          }
        })
        .catch((err) => {
          console.log(err)
          next(createError)
        })
    } catch (err) {
      next(createError)
    }
  },
  userProfile: (req, res, next) => {
    try {
      const { id } = req.params
      userModel
        .getDetailUser(id)
        .then((result) => {
          if (!result.rowCount) {
            console.log('dalah ini')
          } else {
            common.response(
              res,
              result.data,
              'Profile photo updated successfully',
              200
            )
          }
        })
        .catch((error) => {
          console.log(error)
          next(createError)
        })
    } catch (error) {
      console.log(error)
      next(createError)
    }
  }
}

module.exports = {
  userController
}
