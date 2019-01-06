const playerMatchesHandler = require('./playerMatchesHandler');
const users = {}

module.exports = (socket, user) => {
  const {id} = socket
  users[id] = {}

  //disconnect previus connection that somehow haven't been disconnect
  Object.keys(users).forEach(key => {
    if (users[key].user && users[key].user.id == user.id) {
      console.log("previous connection hasn't been deleted:", users[key], key);
      delete users[key]
    }
  })

  //save callbacks into global variable
  users[id].user = user
  users[id].updateUsers = () => {
    const names = []

    //get all all other user online
    Object.keys(users).forEach(key => {
      if (key != id) {
        names.push({username: users[key].user.username, id: key})
      }
    })

    //send update
    socket.emit('updateUsers', names)
  }

  users[id].invite = invitingUser => {
    console.log(`${invitingUser.username} has invited ${user.username} for a chess game`);
    socket.emit('add_invite', invitingUser)
  }

  //call update callback
  updateAllUsers()

  socket.on('invite_user', invitedUser => {
    //send invite with personal data
    users[invitedUser.id].invite({username: user.username, id: id})
  })

  socket.on('invite_accepted', acceptedUser => {
    console.log(`${user.username} has accepted the play request of ${acceptedUser.username} for a chess game`);
    if (users[acceptedUser.id]) {
      removeInvites([id, acceptedUser.id])
      playerMatchesHandler.addMatch(users[acceptedUser.id].getSessionId(), socket.request.session.id)
      users[acceptedUser.id].redirect('/chess/player/play')
      users[id].redirect('/chess/player/play')
      // users[acceptedUser.id].redirect(`/chess/player/play?hosting=${id}`)
      // users[id].redirect(`/chess/player/play?hosted=${acceptedUser.id}`)
      delete users[id]
      delete users[acceptedUser.id]

    } else {
      console.log('invite accepted problem!');
      console.log('users', users);
      console.log('invite', user, acceptedUser.username);
    }
  })

  users[id].redirect = path => {
    console.log(`redirecting ${user.username} to ${path}`);
    socket.emit('redirect', path)
  }

  users[id].getSessionId = () => {
    return socket.request.session.id
  }

  users[id].removeInvite = key => {
    socket.emit('remove_invite', key)
  }

  socket.on('disconnect', () => {
    removeInvites([id])
    delete users[id]
    updateAllUsers()
  })
}

function updateAllUsers() {
  //call update callback to all users waiting
  Object.keys(users).forEach(key => {
    users[key].updateUsers()
  })
}

function removeInvites(usersToRemove) {
  Object.keys(users).forEach(key => {
    usersToRemove.forEach(userToRemove => {
      if (key != userToRemove) {
        users[key].removeInvite(userToRemove)
      }
    })
  })
}

// socket.emit('move', {
//   from: {x: 1, y: 1},
//   to: {x: 1, y: 3},
// })
// socket.emit('move', {
//   from: {x: 6, y: 6},
//   to: {x: 6, y: 5},
// })
// socket.emit('move', {
//   from: {x: 1, y: 3},
//   to: {x: 1, y: 4},
// })
