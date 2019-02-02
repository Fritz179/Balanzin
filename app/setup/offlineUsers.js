module.exports.findOne = (username, password, callback) => {
  for (var i = 0; i < users.length; i++) {
    if (users[i].password == password && users[i].username == username) {
      callback(users[i])
      return
    }
  }

  callback(null)
}

module.exports.findById = (id, callback) => {
  for (var i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      callback(users[id])
      return
    }
  }

  callback(null)
}

const users = [
  {
    id: '5c027e0482c77e9b349fdb93',
    _id: '5c027e0482c77e9b349fdb93',
    name: '11',
    username: '11',
    password: '11'
  },
  {
    id: '5c02b6cc04dc0bb65026cedc',
    _id: '5c02b6cc04dc0bb65026cedc',
    name: '22',
    username: '22',
    password: '22'
  },
  {
    id: '5c152cd675752f42041b949d',
    _id: '5c152cd675752f42041b949d',
    name: 'admin',
    username: 'admin',
    password: 'admin'
  }
]
