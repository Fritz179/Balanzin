module.exports = (socket, user) => {
  console.log(`100: ${user.username} just connected to chess AI!`);
  socket.on('disconnect', () => {

  })
}
