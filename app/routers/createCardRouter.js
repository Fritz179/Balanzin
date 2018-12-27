const checkErrors = require('../models/checkErrors')
const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {getUser, storeUser} = require('../setup/storeUserBySessionId');
const {check, validationResult} = require('express-validator/check');

module.exports = (route, io) => {
  //require('express').Router() must be inside of module.exports else it will break
  const router = require('express').Router()

  //get the json file and parse it, set defaults
  const cards = createCards(route)

  //Display all cards
  router.get('/', (req, res) => {
    res.render(`${route}/${route}`, {cards: cards})
  })

  cards.forEach(card => {

    //if it has to handle the path that the cards leads to, it displays them as a project
    if (card.handleCard) {
      router.get('/' + card.path, card.toAuthenticate ? ensureAuthenticated : pass, card.socket ? storeUser : pass, (req, res) => {
        console.log(card.cardRenderer);
        res.render(card.cardRenderer, {card: card})
      })
    }

    //if it needs the socket connection it uses a file named setupSocket_ + path
    if (card.socket) {
      const setupSocket = require(card.socket);
      io.of(`${route}/${card.path}`).on('connect', socket => {
        getUser(socket, user => {
          setupSocket(socket, user)
        })
      })
    }
  })

  console.log(`200: ${route} Card Router setted up seccesfully`)
  //only the router is returned, the io was changed via pass by reference
  return router
}

function createCards(route) {
  const cards = require(`./${route}/${route}.json`)
  const output = []

  cards.cards.forEach(card => {
    output.push(new createCard(cards, card, route))
  })

  return output
}

//parse the cards
function createCard(cards, card, route) {
  this.route = route
  this.path = card.path
  this.title = card.title
  this.body = card.body || card.title + ' project!'
  this.redirect = (card.pathRedirect || cards.pathRedirect) ? `/${card.path}` : `/${route}/${card.path}`
  this.src = card.src || `public/cards/${route}/${card.path}.png`
  this.toAuthenticate = card.socket || cards.socket || (typeof card.toAuthenticate == 'boolean' ? card.toAuthenticate : cards.toAuthenticate || false)
  this.handleCard = !(card.unhandeled || cards.unhandeled)
  this.cardRenderer = (card.iframe || cards.iframe) ? 'projects/project' : `${route}/${card.path}`
  this.socket = (card.socket || cards.socket) ? `./${route}/setupSocket_${card.path}` : false
}

//ugly solution for ternary operator on line 22
function pass(req, res, next) {
  next()
}
