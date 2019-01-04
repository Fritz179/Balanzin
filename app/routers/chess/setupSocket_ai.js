const games = {}

module.exports = (socket, user) => {
  console.log(`100: ${user.username} just connected to chess AI!`);

  socket.on('getBoard', () => {
    socket.emit('update', 'startingBoard')
    //socket.emit('update', {tiles: [{x: 4, y: 4, newTile: {piece: 'rook', isWhite: true}}]})
  })

  socket.on('disconnect', () => {

  })
}
