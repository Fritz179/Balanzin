module.exports = (socket, user) => {
  console.log(`100: ${user.username} just connected to block_racer!`);

  socket.on('ready', () => {
    socket.emit('maxLevel', 2)
  })

  socket.on('disconnect', () => {

  })
}
