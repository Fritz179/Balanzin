const waiting = []
const waitingRef = {}

module.exports = (socket, user) => {
  waiting.push(user.id)
  waitingRef[user.id] = user
  socket.join('waiting_room')

  io.to('waiting_room').emit('updatePlayers', getNames())

  socket.on('loaded', () => {

  })
}

function getNames() {
  const names = []
  waiting.forEach(w => {
    names.push(waitingRef[w].username)
  })

  return names
}

// socket.emit('move', {
//   from: {x: 1, y: 1},
//   to: {x: 1, y: 3},
// })
// socket.emit('move', {
//   from: {x: 6, y: 6},
//   to: {x: 6, y: 5},
// })
// socket.emit('move', {
//   from: {x: 1, y: 3},
//   to: {x: 1, y: 4},
// })
