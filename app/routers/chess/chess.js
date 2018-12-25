const router = require('express').Router()

const Card = require('../../models/Card');

const checkErrors = require('../../models/checkErrors')
const ensureAuthenticated = require('../../setup/ensureAuthenticated');
const {getUser, storeUser} = require('../../setup/storeUserBySessionId');
const {check, validationResult} = require('express-validator/check');

const setupAiSocket = require('./setupAiSocket')
const setupPlayerSocket = require('./setupPlayerSocket')
const setupSingleSocket = require('./setupSingleSocket')

let cards;
Card.find({type: 'chess'}, (err, doc) => {
  if (err) {
    console.log('503: Chess card not responding!.');
  } else {
    cards = doc
    console.log('200: Chess card redy to be clicked.');
  }
})

router.get('/', (req, res) => {
  res.render('chess/chess', {cards: cards})
})

router.get('/ai', ensureAuthenticated, storeUser, (req, res) => {
  res.render('projects/project', {projectName: `chess/ai`})
})

router.get('/player', ensureAuthenticated, storeUser, (req, res) => {
  res.render('projects/project', {projectName: `chess/player`})
})

router.get('/single', ensureAuthenticated, storeUser, (req, res) => {
  res.render('projects/project', {projectName: `chess/single`})
})

module.exports = (io, dir) => {
  io.of(dir + 'ai').on('connect', socket => {
    getUser(socket, user => {
      setupAiSocket(socket, user)
    })
  })

  io.of(dir + 'player/').on('connect', socket => {
    getUser(socket, user => {
      setupPlayerSocket(socket, user)
    })
  })

  io.of(dir + 'single/').on('connect', socket => {
    getUser(socket, user => {
      setupSingleSocket(socket, user)
    })
  })
  return router
}
