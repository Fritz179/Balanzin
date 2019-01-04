const getGuess = require('./getGuess');

module.exports = (socket, user) => {
  console.log(`100: ${user.username} just connected to wwe Logo!`);

  socket.on('get_new_guess', () => {
    socket.emit('new_guess', getGuess(socket, 'logo'))
  })

  socket.on('guess', name => {
    if (socket.rightName == name) {
      user.wwe.score += 1
      socket.emit('new_guess', getGuess(socket, 'logo'))
    }
  })

  socket.on('disconnect', () => {
    user.save(err => {
      if (err) {
        console.log(err);
      }
    })
  })

  socket.emit('ready')
}
