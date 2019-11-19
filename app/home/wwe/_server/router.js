const {getUser} = require('../../../setup/storeUserBySessionId');
const createSetupSocket = require('./helpers/createSetupSocket');
const modes = require('./helpers/modes');

module.exports = ({io, createRouter, directory, router}) => {
  router.use('/', createRouter(`/${directory}`));

  ['logo', 'final', 'player'].forEach(type => {
    router.use(`/${type}`, (req, res) => {
      res.render(`wwe/index.ejs`, modes[type])
    })

    const setupSocket = createSetupSocket(modes[type])

    io.of(`/wwe/${type}`).on('connection', socket => {
      getUser(socket, user => {
        setupSocket(socket, user)
      })
    })

  })
}
