require('dotenv').config();
//setup express
const passport = require('passport');
const express = require('express')
const app = express()
require('./setup/express.js')(app, passport, __dirname)

const Card = require('./models/Card');
const checkErrors = require('./models/checkErrors')

//start mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {useNewUrlParser: true}).then(() => {
  console.log('Connesso a MongoDB Atlas!');
}, err => {
  console.log(err);
})

app.get('/', (req, res) => {
  Card.find({}, checkErrors(req, res, cards => {
    res.render('home', {cards: cards})
  }))
})

let routes = ['articles', 'users'].forEach(route => {
  let router = require(`./routers/${route}.js`)
  app.use('/' + route, router)
})

app.get('*', (req, res) => {
  res.render('error', {error: 404})
})

const Server = app.listen(process.env.PORT || 1234, () => {
  console.log(`Server online on: http://localhost:${Server.address().port} !!`);
})
