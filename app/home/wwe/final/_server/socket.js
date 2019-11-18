const getElements = require('../../getElements');

function getGuess(socket) {
  const {options, right} = getElements(socket)

  socket.rightName = right.final

  const guess = {
    url: `/wwe/img/foto/${right.id}.jpg`,
    options: options.map(opt => opt.final)
  }

  return guess
}

module.exports = (socket, user) => {
  socket.answered = []
  socket.difficulty = 2

  socket.on('get_new_guess', () => {
    socket.emit('new_guess', getGuess(socket))
  })

  socket.on('guess', name => {
    if (socket.rightName == name) {
      if (user) user.wwe.score += 1

      socket.emit('new_guess', getGuess(socket))
    }
  })

  socket.on('disconnect', () => {
    if (user) {
      user.save(err => {
        if (err) console.log(err)
      })
    }
  })

  socket.on('connection', () => {
    console.log(socket.answered);
    socket.answered = [1, 2]
  })

  socket.emit('ready')
}
