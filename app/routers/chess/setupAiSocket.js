const games = {}

module.exports = (socket, user) => {
  console.log(`100: ${user.username} just connected to chess AI!`);

  socket.on('get_new_guess', () => {
    socket.emit('new_guess', createGuess(socket, mode))
  })

  socket.on('guess', name => {
    if (cards[socket.right].name == name) {
      user.wwe.score += 1
      socket.emit('new_guess', createGuess(socket, mode))
    }
  })

  socket.on('disconnect', () => {
    
  })
  socket.emit('ready')
}
