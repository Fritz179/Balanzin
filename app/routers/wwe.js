const router = require('express').Router()

const User = require('../models/User');
const Wwe_Card = require('../models/Wwe_Card');
const Wwe_Game = require('../models/Wwe_Game');

const checkErrors = require('../models/checkErrors')
const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator/check');

let games;
Wwe_Card.find({}, (err, doc) => {
  if (err) {
    console.log('503: WEE card not responding!.');
  } else {
    games = doc
    console.log('200: WWE card redy to be clicked.');
  }
})
router.get('/', (req, res) => {
  res.render('wwe/wwe', {cards: games})
})

router.get('/logo', ensureAuthenticated, (req, res) => {
    res.render('wwe/guess', {card: {}})
    //set callback
    credentials[req.session.id] = req.user._id
})

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
      setupGuessSocket(socket, user, 'logo')
    })
  })

  io.of(dir + 'player').on('connect', socket => {
    getUserBySessionId(socket, user => {
      setupGuessSocket(socket, user, 'player')
    })
  })
  return router
}

function setupGuessSocket(socket, user, mode) {
  console.log(`${user.username} just connected to ${mode}!`);

  socket.on('get_new_guess', () => {
    socket.emit('new_guess', createGuess(socket, mode))
  })

  socket.on('guess', name => {
    if (cards[socket.right].name == name) {
      user.wwe.score += 1
      socket.emit('new_guess', createGuess(socket, mode))
    }
  })

  socket.on('disconnect', () => {
    console.log(`new score for ${user.username} of ${user.wwe.score}`);
    user.save(err => {
      console.log(`${user.username} just diconnncted from ${mode}, data ${err ? 'not saved!': 'saved succesfully (hopefully)'}`);
    })
  })
  socket.emit('ready')
}

function createGuess(socket, mode = 'logo') {
  const max = 3
  let num = []
  for (let i = 0; i < max; i++) {
    num.push(r(cards.length, [...num, socket.right]))
  }

  socket.right = num[r(max)]
  let guess = {
    url: cards[socket.right][mode],
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
