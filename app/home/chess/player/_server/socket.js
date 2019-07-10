const playerMatchesHandler = require('../playerMatchesHandler');
const sockets = {}

module.exports = (socket, user) => {
  const sessionId = socket.request.session.id

  //save callbacks into {socket} of sockets
  socket.updateUsers = () => {
    const names = Object.keys(sockets).filter(id => id != sessionId).map(id => {
      return {username: sockets[id].user.username, id}
    })
    //send update
    socket.emit('updateUsers', names)
  }

  socket.invite = otherId => {
    const otherUsername = sockets[otherId].user.username
    console.log(`${otherUsername} has invited ${user.username} for a chess game`);

    socket.emit('add_invite', {username: otherUsername, id: otherId})
  }

  socket.redirect = path => socket.emit('redirect', path)
  socket.removeInvite = key => socket.emit('remove_invite', key)

  socket.on('invite_user', otherId => {
    if (sockets[otherId]) {
      sockets[otherId].socket.invite(sessionId)
    } else {
      socket.updateUsers()
    }
  })

  socket.on('invite_accepted', otherId => {
    if (sockets[otherId]) {
      const otherUsername = sockets[otherId].user.username
      console.log(`${user.username} has accepted the play request of ${otherUsername} for a chess game`);

      playerMatchesHandler.addMatch(otherId, sessionId)
      sockets[otherId].socket.redirect('/chess/player/play')
      socket.redirect('/chess/player/play')
    } else {
      console.log('invite accepted problem!');
      console.log('users', users);
      console.log('ids', sessionId, otherId);
      socket.updateUsers()
    }
  })

  //save sockets reference
  sockets[sessionId] = {
    socket: socket,
    user: user
  }

  socket.on('disconnect', () => {
    removeInvites(sessionId)
    delete sockets[sessionId]
    updateAllUsers()
  })

  updateAllUsers()
}

function updateAllUsers() {
  //call update callback to all users waiting
  Object.keys(sockets).forEach(key => {
    sockets[key].socket.updateUsers()
  })
}

function removeInvites(otherId) {
  Object.keys(sockets).forEach(key => {
    if (key != otherId) {
      sockets[key].socket.removeInvite(otherId)
    }
  })
}
