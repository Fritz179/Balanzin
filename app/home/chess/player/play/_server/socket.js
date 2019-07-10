const playerMatchesHandler = require('../../playerMatchesHandler');
const matches = {}

module.exports = (socket, user) => {
  const sessionId = socket.request.session.id
  const {gameId, isWhite} = playerMatchesHandler.getGameById(sessionId)

  if (!gameId) {
    return socket.emit('redirect', '/chess/player')
  }

  socket.emit('setColor', isWhite)

  const myColor = isWhite ? 'white' : 'black'
  const opColor = isWhite ? 'black' : 'white'

  //save matches reference or get the alredy created
  let first = !matches[gameId]
  if (first) {
    matches[gameId] = {moves: []}
  }

  const game = matches[gameId]

  game[myColor] = {
    socket: socket,
    user: user
  }

  socket.emit('loadBoard', {isWhite, moves: game.moves})

  socket.on('move', move => {
    game.moves.push(move)

    if (game[opColor]) {
      game[opColor].socket.emit('move', move)
    }
  })

  socket.on('disconnect', () => {
    delete game[myColor]

    if (game[opColor]) {
      game[opColor].socket.emit('opp_disconnected')
    } else {
      playerMatchesHandler.endGame(gameId)
      delete matches[gameId]
    }
  })
}
