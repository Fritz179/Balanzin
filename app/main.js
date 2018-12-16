//get .env
require('dotenv').config();

//setup express
const express = require('express')
const io = require('socket.io')()
const app = express()
require('./setup/express.js')(app, io, __dirname)

const Card = require('./models/Card');
const checkErrors = require('./models/checkErrors')

//connect to mongoDB Atlaswith mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {useNewUrlParser: true}).then(() => {
  console.log('200: Connection with mongoDB Atlas established.');
}, err => {
  console.error('503: Connection with mongoDB Atlas failed!.');
})

let cards
Card.find({}, (err, doc) => {
  if (err) {
    console.log('503: Home cards not responding!.');
  } else {
    cards = doc
    console.log('200: Home card redy to be shown.');
  }
})

app.get('/', (req, res) => {
  res.render('home/home', {cards: cards})
})

let routes = ['articles', 'users', 'projects', 'admin'].forEach(route => {
  let router = require(`./routers/${route}.js`)
  app.use('/' + route, router)
})

let sockets = ['wwe'].forEach(route => {
  let router = require(`./routers/${route}.js`)
  app.use('/' + route, router(io, `/${route}/`))
})

app.get('*', (req, res) => {
  res.render('error', {error: 404})
})

const Server = app.listen(process.env.PORT || 1234, () => {
  console.log(`200: Server online on: http://localhost:${Server.address().port} !!`);
  io.attach(Server)
})

//tothpick, calculator, wordfinder, boids
//v1 articles
//v1.1.1 7segment
//v1.1.2 WWE
//v1.2 Refactored routes
