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

  app.use(require('connect-flash')());

  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  app.set('view engine', 'ejs')
  app.set('views', [path.join(dirname, 'home'), path.join(dirname, 'template')])

  app.use('/libraries', express.static(path.join(dirname, 'template/libraries')))
  app.use('/fonts', express.static(path.join(dirname, 'template/fonts')))

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
    req.originalUrl.match(/_server/) ? next() : staticHandler(req, res, next)
  })

  app.get('/favicon.ico', (req, res) => res.sendFile(path.join(dirname, 'template/favicon.png')))
  app.get('/robots.txt', (req, res) => res.sendFile(path.join(dirname, 'template/robots.txt')))

  require('./passport')(passport)

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.user = req.user || null
    res.locals.messages = req.messages || []
    next()
  })
}

console.log('200: Express setup run succesfully!');
