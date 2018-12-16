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

  app.set('views', path.join(dirname, 'views'))
  app.set('view engine', 'ejs')

  app.use(express.static(path.join(dirname, 'public')))

  require('./passport')(passport)

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
  })
}

console.log('200: Express setted up succesfully');
