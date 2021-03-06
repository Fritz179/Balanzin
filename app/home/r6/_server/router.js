const {join} = require('path')

module.exports = ({router, io}) => {
  router.get(`/`, (req, res) => {
    res.render('r6/index.ejs')
  })

  const sockets = new Map()

  io.of('r6').on('connection', socket => {
    const {id} = socket
    if (!sockets.has(id)) {
      // forward offer
      socket.on('offer', (to, offer) => {
        // console.log(`offer from: ${id}, to: ${to}`);
        const toSocket = sockets.get(to)
        if (toSocket) {
          toSocket.emit('offer', id, offer)
        }
      })

      // forward candidate
      socket.on('candidate', (to, candidate) => {
        const toSocket = sockets.get(to)
        if (toSocket) {
          toSocket.emit('candidate', id, candidate)
        }
      })

      // forward response
      socket.on('response', (to, response) => {
        // console.log(`aswer from: ${id}, to: ${to}`);
        const toSocket = sockets.get(to)
        if (toSocket) {
          toSocket.emit('response', id, response)
        }
      })

      // change name
      socket.on('setName', (name) => {
        console.log(`Renamed: ${socket.name}, to: ${name}`);
        socket.name = name
        io.of('r6').emit('setName', id, name)
      })

      // remove on disconnect
      socket.on('disconnect', () => {
        io.of('r6').emit('disconnectPeer', id)
        sockets.delete(id)
        console.log('Disconnected: ' + socket.name);
      })

      // start requests
      socket.emit('request-offer', [...sockets.keys()], id);

      // default name to id
      socket.name = socket.id
      sockets.forEach((to, of) => {
        socket.emit('setName', of, to.name)
      })

      // add socket only ofter request has started
      sockets.set(id, socket)
      console.log('New connection: ' + socket.name);
    }
  })
}
