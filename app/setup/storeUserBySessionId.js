const User = require('../models/User');
const offlineUsers = require('./offlineUsers');

const credentials = {}

module.exports.getUser = (socket, callback) => {
  const userId = credentials[socket.request.session.id]
  if (!userId) {
    socket.emit('redirect', '/users/login?from=')
    console.log('400: failed attempt to log in with socket');
  } else {
    const off = offlineUsers.findOneById(userId)
    if (off) {
      callback(off)
      return
    }

    const user = User.findOne({_id: userId}, (err, doc) => {
      if (err) {
        socket.emit('redirect', '/errors')
        console.log(err);
      } else if (doc) {
        callback(doc)
      } else {
        socket.emit('redirect', '/errors')
        console.log('storeUserBySessionId:20 nodoc');
      }
    })
  }
}

module.exports.storeUser = (req, res, next) => {
  console.log(req.user._id);
  if (credentials[req.session.id]) {
    console.log('500: credentials already has a key for session id!');
    console.log(credentials);
    console.log(credentials[req.session.id], req.session.id, req.user._id);
  } else {
    credentials[req.session.id] = req.user._id
  }
  next()
}
