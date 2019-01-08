module.exports.findOne = (username, password) => {
  let auth
  users.forEach(user => {
    if (user.password == password && user.username == username) {
      auth = user
    }
  })
  return auth || false
}

module.exports.findOneById = id => {
  let auth
  users.forEach(user => {
    if (user.id == id) {
      auth = user
    }
  })
  return auth || false
}

const users = [
  {
    id: '5c027e0482c77e9b349fdb93',
    _id: '5c027e0482c77e9b349fdb93',
    name: '1',
    username: '1',
    password: '1'
  },
  {
    id: '5c02b6cc04dc0bb65026cedc',
    _id: '5c02b6cc04dc0bb65026cedc',
    name: '2',
    username: '2',
    password: '2'
  },
  {
    id: '5c152cd675752f42041b949d',
    _id: '5c152cd675752f42041b949d',
    name: '3',
    username: '3',
    password: '3'
  }
]
