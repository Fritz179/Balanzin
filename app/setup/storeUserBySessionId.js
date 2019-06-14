const User = require('../models/User');

const credentials = {}

module.exports.getUser = (socket, callback) => {

  const userId = credentials[socket.request.session.id]
  if (!userId) return callback(false)

  const user = User.findOne({_id: userId}, (err, doc) => {
    if (err) {
      console.log(err);
      return callback(false)
    } else if (doc) {
      return callback(doc)
    } else {
      console.log('storeUserBySessionId:20 nodoc', userId);
      return callback(false)
    }
  })

}

module.exports.storeUser = (req, res, next) => {
  if (credentials[req.session.id]) {
    console.log('500: credentials already has a key for session id!');
    console.log(credentials);
    console.log(credentials[req.session.id], req.session.id, req.user._id);
  } else {
    credentials[req.session.id] = req.user._id
  }
  next()
}
