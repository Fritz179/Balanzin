const socket = connect('/chess/player')

const usersTitle = document.getElementById('title')
const userList = document.getElementById('player_list')
const invitesList = document.getElementById('invite_list')

const alreadyInvited = []
let invites = []

socket.on('updateUsers', users => {
  userList.innerHTML = ''
  if (users.length) {
    usersTitle.innerHTML = 'Choose a player to play against'
    users.forEach(user => {
      userList.appendChild(createItem(user))
    })
  } else {
    usersTitle.innerHTML = 'It looks like you are the only player waiting...'
  }
})

socket.on('add_invite', user => {
  invites.push(user)
  displayInvites()
})

socket.on('remove_invite', userId => {
  invites = invites.filter(invite => invite.id != userId)
  displayInvites()
})

function displayInvites() {
  invitesList.innerHTML = ''
  invites.forEach(invite => {
    invitesList.appendChild(createItem(invite, true))
  })
}

function createItem(user, isInvite = false, userId) {
  const item = document.createElement('li')
  const link = document.createElement('a')

  item.classList.add("li");
  link.innerHTML = user.username
  link.href = '#'
  link.onclick = () => {
    if (isInvite) {
      socket.emit('invite_accepted', user.id)
      link.innerHTML = user.username + ' (already accepted!)'
    } else {
      if (!alreadyInvited.includes(user.username)) {
        alreadyInvited.push(user.username)
        link.innerHTML = user.username + ' (already invited!)'
        socket.emit('invite_user', user.id)
      } else {
        link.innerHTML = user.username + ' (already invited!)'
      }
    }
  }
  item.appendChild(link)

  return item
}
