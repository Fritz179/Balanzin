function connect(path) {
  const socket = io.connect(path)

  socket.on('log', toLog => {
    console.log(toLog);
  })

  socket.on('redirect', url => {
    window.top.location.assign(url)
  })

  return socket
}

console.log('socket utils');
