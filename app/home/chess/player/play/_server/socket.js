const playerMatchesHandler = require('../../playerMatchesHandler');
const global = {}
const matches = {}

module.exports = (socket, user) => {
  const sessionId = socket.request.session.id
  const {gameId, isWhite} = playerMatchesHandler.getGameById(sessionId)

  const myColor = isWhite ? 'white' : 'black'
  const opColor = isWhite ? 'black' : 'white'

  if (!gameId) {
    socket.emit('redirect', '/chess/player')
    return
  }

  socket.on('loaded', () => {
    //save matches reference or get the alredy created
    let first = true
    if (matches[gameId]) {
      first = false
    } else {
      matches[gameId] = {moves: []}
    }
    const game = matches[gameId]

    game[myColor] = {
      socket: socket,
      user: user
    }

    socket.move = move => {
      socket.emit('update', {key: 'move', data: move})
    }

    socket.start = () => {
      socket.started = true
      socket.emit('update', {key: 'setColor', data: isWhite})
      game.moves.forEach(move => {
        socket.move(move)
      })

      socket.on('move', move => {
        game.moves.push(move)
        game[opColor].socket.move(move)
      })
    }

    if (!first) {
      socket.start()
      if (!game[opColor].socket.started) {
        game[opColor].socket.start()
      }
    }
  })

  socket.on('disconnect', () => {
    matches[gameId][myColor] = null
    setTimeout(() => {
      if (socket.disconnected && matches[gameId][opColor].socket.disconnected) {
        playerMatchesHandler.endGame(gameId)
      }
    }, 1000)
  })
}
