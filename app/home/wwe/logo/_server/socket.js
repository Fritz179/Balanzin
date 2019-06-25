const getGuess = require('../../getGuess');

module.exports = (socket, user) => {
  socket.on('get_new_guess', () => {
    socket.emit('new_guess', getGuess(socket, 'logo'))
  })

  socket.on('guess', name => {
    if (socket.rightName == name) {
      if (user) user.wwe.score += 1
      
      socket.emit('new_guess', getGuess(socket, 'logo'))
    }
  })

  socket.on('disconnect', () => {
    if (user) {
      user.save(err => {
        if (err) console.log(err)
      })
    }
  })

  socket.emit('ready')
}
