const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {getUser} = require('../setup/storeUserBySessionId');
const {join} = require('path');
const fs = require('fs');

module.exports = (io) => {

  function createRouter(topDirectory = '/') {
    //require('express').Router() must be inside of module.exports else it will break
    const router = require('express').Router()

    //get the json file containig all informations
    const cards = JSON.parse(fs.readFileSync(join(__dirname, '../home', topDirectory, '_server/.json')))

    //get the topDirectory, display the appropiate cardMenu
    router.get('/', (req, res) => {
      res.render(`cardMenu`, {cards})
    })

    //iloop through all card to check for subdirectories
    cards.cards.forEach(card => {
      card.topDirectory = topDirectory

      //get parameters, default to cards parameters
      const {extend, load, path, authenticate = cards.authenticate} = card
      const {socket = cards.socket, subSockets = cards.subSockets = []} = card

      //get the subDirectory
      const subDirectory = card.subDirectory = extend || load || path
      if (!subDirectory) throw new Error(`Please specify a extend, load, or path at: ${topDirectory}, for ${cart.title}`)

      //concatenate topDirectory and subDirectory to get the complete directory
      const directory = card.directory = join(topDirectory, subDirectory)

      //add the topDirectory to the img if not present
      if (!card.imgPath) card.imgPath = join(topDirectory, '_server', subDirectory + '.png')

      //check for authentication and choose if a subrouter is needed
      const toAuthenticate = authenticate ? ensureAuthenticated : []

      let handler

      if (extend) handler = createRouter(directory)
      else if (load) handler = loadRouter(directory)
      else handler = (req, res) => res.render(join('.' + directory, 'index.ejs'), {card})

      router.use(`/${subDirectory}`, toAuthenticate, handler)

      //if socket is needed, create a listener
      if (socket) loadSocket(typeof socket == 'string' ? socket : directory)
    })

    return router
  }

  function loadSocket(socketName) {
    //require the module to call when a socket is connected
    const setupSocket = require(join(__dirname, '../home', socketName, '_server/socket.js'))

    io.of(`/${socketName}`).on('connect', socket => {
      getUser(socket, user => {
        setupSocket(socket, user)
      })
    })
  }

  function loadRouter(directory) {
    const setupRouter = require(join(__dirname, '../home', directory, '_server/router.js'));
    const router = require('express').Router()

    setupRouter({router, io, loadSocket, directory})

    return router
  }

  return createRouter()
}
