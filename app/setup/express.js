const bodyParser  = require('body-parser')
const session = require('express-session')
const path = require('path')
const express = require('express')
const passport = require('passport');

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
})

module.exports = (app, io, dirname) => {
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())

  app.use(sessionMiddleware);

  app.use((req, res, next) => {
    if (req.flash) return next()

    req.flash = function (type, message) {
      const messages = this.session.flash = this.session.flash || {}

      if (type && message) {
        // if it's a new type, create a new array
        if (!messages[type])
          messages[type] = []

        messages[type].push(message)
        return
      }

      // with no parameters return messages and delete them
      this.session.flash = {}
      return messages
    }

    res.locals.messages = () => req.flash()

    next()
  });

  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  app.set('view engine', 'ejs')
  app.set('views', [path.join(dirname, 'home'), path.join(dirname, 'template')])

  app.use('/libraries', express.static(path.join(dirname, 'template/libraries')))
  app.use(express.static(path.join(dirname, 'misc')))

  app.use(/\/template\/.*\.css/, (req, res, next) => {
    res.sendFile(path.join(dirname, req.originalUrl))
  })

  app.use((req, res, next) => {
    if (req.originalUrl.match(/\.(png|jpg)$/)){
      res.sendFile(path.join(dirname, 'home', req.originalUrl))
    } else {
      next()
    }
  })

  const staticHandler = express.static(path.join(dirname, 'home'))
  app.use((req, res, next) => {
    // deny public access to _server files
    req.originalUrl.match(/_server/) ? next() : staticHandler(req, res, next)
  })

  require('./passport')(passport)

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
  })

  console.log('200: Express setup run succesfully!');
}
