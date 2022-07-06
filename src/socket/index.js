const { store, list, deleteMessage } = require('../models/chats.models')

module.exports = (io, socket) => {
  socket.on('ping', (data) => {
    socket.emit('ping-response', data)
  })
  socket.on('join-room', (data) => {
    const {
      id, email, password, username
    } = data
    socket.join(id)
  })
  socket.on('send-message', (data) => {
    store(data).then(async () => {
      // send message
      const listChats = await list(data.sender, data.receiver)
      io.to(data.receiver).emit('send-message-response', listChats.rows)
    }).catch((err) => {
      console.log(err)
    })
  })
  socket.on('chat-history', async (data) => {
    const listChats = await list(data.sender, data.receiver)
    io.to(data.sender).emit('send-message-response', listChats.rows)
  })
  socket.on('delete-message', async (data) => {
    const { id, receiver, sender } = data
    deleteMessage(id)
    const res = await list(sender, receiver)
    io.to(sender).emit('send-message-response', res.rows)
  })
}
