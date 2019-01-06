module.exports = (socket, user) => {
  console.log(`100: ${user.username} just connected to chess play!`);
  console.log(socket.request.session.id);
  const queries = Object.keys(socket.handshake.query)

  // if (queries.includes('hosting')) {
  //
  // } else if (queries.includes('hosted')) {
  //
  // } else {
  //   console.log('handshake', socket.handshake.query);
  //   socket.emit('redirect', '/chess/player')
  // }

  socket.on('loaded', () => {
    socket.emit('update', 'startNewBoard')
  })

  socket.on('disconnect', () => {

  })
}
