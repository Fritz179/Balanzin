const playerMatchesHandler = require('../playerMatchesHandler');
const global = {}

module.exports = (socket, user) => {
  const sessionId = socket.request.session.id

  //save global reference
  global[sessionId] = {
    socket: socket,
    user: user
  }

  //save callbacks into {socket} of global variable
  socket.updateUsers = () => {
    const names = []

    //get all all other user online
    Object.keys(global).forEach(key => {
      if (key != sessionId) {
        names.push({username: global[key].user.username, id: key})
      }
    })
    //send update
    socket.emit('updateUsers', names)
  }
  //call update callback
  updateAllUsers()

  socket.on('invite_user', otherId => {
    //send invite with personal data
    global[otherId].socket.invite(sessionId)
  })

  socket.invite = otherId => {
    const otherUsername = global[otherId].user.username
    console.log(`${otherUsername} has invited ${user.username} for a chess game`);

    socket.emit('add_invite', {username: otherUsername, id: otherId})
  }

  socket.on('invite_accepted', otherId => {
    if (global[otherId]) {
      const otherUsername = global[otherId].user.username || 'error'
      console.log(`${user.username} has accepted the play request of ${otherUsername} for a chess game`);

      playerMatchesHandler.addMatch(otherId, sessionId)
      global[otherId].socket.redirect('/chess/player/play')
      socket.redirect('/chess/player/play')
    } else {
      console.log('invite accepted problem!');
      console.log('users', users);
      console.log('ids', sessionId, otherId);
    }
  })

  socket.redirect = path => {
    socket.emit('redirect', path)
  }

  socket.removeInvite = key => {
    socket.emit('remove_invite', key)
  }

  socket.on('disconnect', () => {
    removeInvites(sessionId)
    delete global[sessionId]
    updateAllUsers()
  })
}

function updateAllUsers() {
  //call update callback to all users waiting
  Object.keys(global).forEach(key => {
    global[key].socket.updateUsers()
  })
}

function removeInvites(otherId) {
  Object.keys(global).forEach(key => {
    if (key != otherId) {
      global[key].socket.removeInvite(otherId)
    }
  })
}
