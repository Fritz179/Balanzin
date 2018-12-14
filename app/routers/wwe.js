const express = require('express');
const router = express.Router()

const User = require('../models/User');
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

router.get('/logo', ensureAuthenticated, (req, res) => {
  Wwe_Game.find({}, checkErrors(req, res, cards => {
    const params = getGuess(cards)
    res.render('guess', {card: params})

    //set callback
    credentials[req.session.id] = req.user._id
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

const credentials = {}

let cards;
Wwe_Game.find({}, (err, doc) => {
  if (err) {
    console.log('503: Guess card not responding!.');
  } else {
    cards = doc
    console.log('200: Guess card redy to play.');
  }
})

module.exports = (io, dir) => {
  io.of(dir + 'logo').on('connect', socket => {
    getUserBySessionId(socket, user => {
      console.log(`${user.username} just connected to logo!`);
      socket.on('get_new_guess', () => {
        socket.emit('new_guess', createGuess(socket))
      })

      socket.on('guess', name => {
        if (cards[socket.right].name == name) {
          user.wwe.score += 1
          socket.emit('new_guess', createGuess(socket))
        }
      })

      socket.on('disconnect', () => {
        console.log(`new score for ${user.username} of ${user.wwe.score}`);
        user.save(err => {
          console.log(`${user.username} just diconnncted from guess, data ${err ? 'not saved!': 'saved succesfully (hopefully)'}`);
        })
      })
      socket.emit('ready')
    })
  })

  // io.of(dir + 'player').on('connect', socket => {
  //   getUserBySessionId(socket, user => {
  //     console.log(`${user.username} just connected to player!`);
  //     socket.on('get_new_guess', () => {
  //       socket.emit('new_guess', createGuess(socket))
  //     })
  //
  //     socket.on('guess', name => {
  //       if (cards[socket.right].name == name) {
  //         user.wwe.score += 1
  //         socket.emit('new_guess', createGuess(socket))
  //       }
  //     })
  //
  //     socket.on('disconnect', () => {
  //       console.log(`new score for ${user.username} of ${user.wwe.score}`);
  //       user.save(err => {
  //         console.log(`${user.username} just diconnncted from guess, data ${err ? 'not saved!': 'saved succesfully (hopefully)'}`);
  //       })
  //     })
  //     socket.emit('ready')
  //   })
  // })
  return router
}

function createGuess(socket) {
  const max = 3
  let num = []
  for (let i = 0; i < max; i++) {
    num.push(r(cards.length, [...num, socket.right]))
  }

  socket.right = num[r(max)]
  let guess = {
    url: cards[socket.right].logo,
    options: num.map(n => cards[n].name)
  }
  return guess
}

function r(max, excluded = []) {
  let output
  do {
    output = Math.floor(Math.random() * max)
  } while (excluded.includes(output))
  return output
}

function getUserBySessionId(socket, callback) {
  const id = credentials[socket.request.session.id]
  if (!id) {
    socket.emit('redirect', '/users/login')
    console.log('400: failed attempt to log in logo');
  } else {
    delete credentials[socket.request.session.id]
    const user = User.findOne({_id: id}, (err, doc) => {
      if (err) {
        socket.emit('redirect', '/errors')
        console.log(err);
      } else if (doc) {
        callback(doc)
      } else {
        socket.emit('redirect', '/errors')
        console.log('nodoc');
      }
    })
  }
}
