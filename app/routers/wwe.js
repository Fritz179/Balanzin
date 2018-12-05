const express = require('express');
const router = express.Router()

const Wwe_Card = require('../models/Wwe_Card');
const Wwe_Game = require('../models/Wwe_Game');

const checkErrors = require('../models/checkErrors')
const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator/check');

router.get('/', (req, res) => {
  Wwe_Card.find({}, checkErrors(req, res, cards => {
    res.render('wwe', {cards: cards})
  }))
})

router.get('/guess', (req, res) => {
  Wwe_Game.find({}, checkErrors(req, res, cards => {
    const params = getGuess(cards)
    res.render('guess', {card: params})
  }))
})

function getGuess(cards) {
  let r = Math.round(Math.randon)
}

function r(max) {
  if (typeof max == 'Array') {
    return r(max.length)
  } else {
    return Math.round(Math.random() * max)
  }
}

module.exports = router
