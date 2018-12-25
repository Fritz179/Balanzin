const User = require('../models/User');

const credentials = {}

module.exports.getUser = (socket, callback) => {
  const id = credentials[socket.request.session.id]
  if (!id) {
    socket.emit('redirect', '/users/login?from=/wwe')
    console.log('400: failed attempt to log in logo');
  } else {
    delete credentials[socket.request.session.id]
    const user = User.findOne({_id: id}, (err, doc) => {
      if (err) {
        socket.emit('redirect', '/errors')
        console.log(err);
      } else if (doc) {
        callback(doc)
      } else {
        socket.emit('redirect', '/errors')
        console.log('nodoc');
      }
    })
  }
}

module.exports.storeUser = (req, res, next) => {
  //set callback
  credentials[req.session.id] = req.user._id
  next()
}

setInterval(() => {
  console.log('credentials of storeUserBySessionId:')
  console.log(credentials)
}, 5000)
