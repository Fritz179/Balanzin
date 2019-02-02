module.exports = (socket, user) => {
  console.log(`100: ${user.username} just connected to block_racer!`);

  socket.on('info', () => {
    socket.emit('info', {
      unlockedLevel: 3
    })
  })

  socket.on('disconnect', () => {

  })
}
