const { v4: uuidV4 } = require('uuid')
const db = require('../config/db')

module.exports = {
  store: (data) => new Promise((resolve, reject) => {
    const id = uuidV4()
    const {
      sender, receiver, message, chatType, isRead, date
    } = data
    db.query('INSERT INTO chats (id, sender, receiver, message, chat_type, date, is_read) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, sender, receiver, message, chatType, date, isRead], (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  }),
  list: (sender, receiver) => new Promise((resolve, reject) => {
    db.query(
      `SELECT chats.id, chats.message,chats.date, userSender.id AS sender_id, userSender.photo AS sender_photo, userReceiver.photo AS receiver_photo, userReceiver.id AS receiver_id, userSender.username AS sender, userReceiver.username AS receiver FROM chats LEFT JOIN users AS userSender ON chats.sender=userSender.id LEFT JOIN users AS userReceiver ON chats.receiver=userReceiver.id WHERE (sender='${sender}' AND receiver='${receiver}') OR (sender='${receiver}' AND receiver='${sender}') ORDER BY chats.date ASC`,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    )
  }),
  deleteMessage: (id) => new Promise((resolve, reject) => {
    db.query('DELETE FROM chats WHERE id=$1', [id], (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
