const bodyParser  = require('body-parser')
const session = require('express-session')
const path = require('path')
const express = require('express')

module.exports = (app, passport, dirname) => {
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())

  app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  }))

  app.use(require('connect-flash')());

  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });
  
  let paths = [path.join(dirname, 'views')]
  let l = ['articles', 'users', 'home', 'projects', 'admin', 'wwe']
  l.forEach(obj => {
    paths.push(path.join(dirname, 'views/' + obj))
  })
  app.set('views', paths)
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
