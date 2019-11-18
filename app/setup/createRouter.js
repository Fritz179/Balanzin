const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {getUser} = require('../setup/storeUserBySessionId');
const {join} = require('path');
const fs = require('fs');

module.exports = (io, dirname = join(__dirname, '../home')) => {

  function createRouter(topDirectory = '\\') {
    //require('express').Router() must be inside of module.exports else it will break
    const router = require('express').Router()

    //get the json file containig all informations,
    //if no renderer is specified, its defaulted to cardMenu
    const json = JSON.parse(fs.readFileSync(join(dirname, topDirectory, '_server/.json')))
    const {renderer, redirect, cards = [], subDir = [], preventRecursion = false} = json
    const toLoad = cards.concat(subDir)

    //get the topDirectory, display the appropiate cardMenu
    if (renderer !== false) {
      router.get('/', (req, res) => {
        if (redirect) res.redirect(redirect)
        else if (renderer) res.render(join('.' + topDirectory, renderer), json)
        else if (cards.length) res.render('cardMenu', json)
        else res.render(join('.' + topDirectory, 'index.ejs'))
      })
    }

    // loop through all card to check for subdirectories
    toLoad.forEach(card => {
      card.topDirectory = topDirectory

      // get parameters, default to .json parameters
      const {extend, path, custom, authenticate = json.authenticate} = card
      const {socket = json.socket, subSockets = json.subSockets = []} = card
      const {preventRecursion = json.preventRecursion} = card

      // get the subDirectory
      const subDirectory = card.subDirectory = extend || custom || path
      if (!subDirectory) throw new Error(`Please specify a extend, custom, or path at: ${topDirectory}`)

      // concatenate direcotories
      card.serverDirectory = join(topDirectory, '_server')
      const directory = card.directory = join(topDirectory, subDirectory)

      if (!preventRecursion) {

        // check for authentication and choose if a subrouter is needed
        const toAuthenticate = authenticate ? ensureAuthenticated : []

        let handler
        if (extend) handler = createRouter(directory)
        else if (custom) handler = customRouter(directory)
        else handler = (req, res) => res.render(join('.' + directory, 'index.ejs'), {card})

        router.use(`/${subDirectory}`, toAuthenticate, handler)

        // if socket is needed, create a listener
        if (socket) loadSocket(typeof socket == 'string' ? socket : directory, authenticate)
      }
    })

    return router
  }

  function loadSocket(socketName, withUser = false) {
    //require the module to call when a socket is connected
    const setupSocket = require(join(dirname, socketName, '_server/socket.js'))
    socketName = socketName.replace(/\\+/g, '/')

    io.of(socketName).on('connection', socket => {
      getUser(socket, user => {
        if (!user && withUser) return socket.emit('redirect', '/users/login?from=' + socketName)
        else return setupSocket(socket, user)
      })
    })
  }

  function customRouter(directory) {
    const setupRouter = require(join(dirname, directory, '_server/router.js'));
    const router = require('express').Router()

    directory = directory.replace(/^(\\|\/)+/, '')

    setupRouter({router, io, loadSocket, directory, createRouter, customRouter})

    return router
  }

  return createRouter()
}
