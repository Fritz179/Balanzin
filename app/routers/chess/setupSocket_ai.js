const games = {}

module.exports = (socket, user) => {
  console.log(`100: ${user.username} just connected to chess AI!`);

  //emit first update at ready

  socket.on('disconnect', () => {

  })
  socket.emit('ready')
}
