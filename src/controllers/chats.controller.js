const chatsModels = require('../models/chats.models')
const { response, failed } = require('../helper/common')

module.exports = {
  deleteMessage: async (req, res) => {
    try {
      const { id } = req.params
      const result = await chatsModels.deleteMessage(id)
      response(res, result, 'delete chat Success', 200)
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal server errror!'
      })
    }
  }
}
