const getElements = require('./getElements');

module.exports = ({prop, folder}) => {
  function getGuess(socket) {
    const {options, right} = getElements(socket)

    socket.rightName = right[prop]

    const guess = {
      url: `/wwe/img/${folder}/${right.id}.jpg`,
      options: options.map(opt => opt[prop])
    }

    return guess
  }

  return (socket, user) => {
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

    socket.emit('ready')
  }
}
