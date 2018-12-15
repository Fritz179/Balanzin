require('dotenv').config();
//setup express
const passport = require('passport');
const express = require('express')
const io = require('socket.io')()
const app = express()
require('./setup/express.js')(app, passport, io, __dirname)

const Card = require('./models/Card');
const checkErrors = require('./models/checkErrors')

//start mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {useNewUrlParser: true}).then(() => {
  console.log('200: Connection with mongoDB Atlas established.');
}, err => {
  console.error('503: Connection with mongoDB Atlas failed!.');
})

app.get('/', (req, res) => {
  Card.find({}, checkErrors(req, res, cards => {
    res.render('home', {cards: cards})
  }))
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

//tothpick, calculator, wordfinder,
//v1 articles
//v1.1 7segment
//v1.2 WWE
