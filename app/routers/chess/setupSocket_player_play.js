const playerMatchesHandler = require('./playerMatchesHandler');
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
    console.log(matches, gameId, sessionId, isWhite);
    if (matches[gameId]) {
      first = false
      console.log(`100: ${user.username} just connected to a chess game!`);
    } else {
      matches[gameId] = {moves: []}
      console.log(`100: ${user.username} just instantieted a chess game!`);
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
      console.log('starting:' + user.username);
      socket.started = true
      socket.emit('update', {key: 'startNewBoard'})
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
      console.log('starting');
      socket.start()
      if (!game[opColor].socket.started) {
        game[opColor].socket.start()
      }
    }
  })

  socket.on('disconnect', () => {
    if (socket.disconnected && matches[gameId][opColor].socket.disconnected)
    setTimeout(() => {
      if (socket.disconnected && matches[gameId][opColor].socket.disconnected) {
        console.log('ending game: ' + gameId);
        playerMatchesHandler.endGame(gameId)
      }
    }, 1000)
  })
}
