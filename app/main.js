require('dotenv').config();

//setup express
const app = require('express')()
const io = require('socket.io')()
const path = require('path')
require('./setup/express.js')(app, io, __dirname)

//connect to mongoDB Atlas with mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {useNewUrlParser: true}).then(() => {
  console.log('200: Connection with mongoDB Atlas established.');
}, err => {
  console.error('503: Connection with mongoDB Atlas failed!.');
  console.error('503: Es tacu al wifi? (bambursa)');
})

//create router from ../home
const router = require('./setup/createRouter.js')(io, path.join(__dirname, 'home'));
app.use('/', router)

//connect the error page to all remaining requests (404)
app.get('*', (req, res) => {
  if (!res._header) {
    res.render('error', {error: 404})
  }
})

//connect Server to localhost
const Server = app.listen(process.env.PORT || 1234, () => {
  console.log(`200: Server online on: http://localhost:${Server.address().port} !!`);
  io.attach(Server)
})

/*
  //todo: adjust chess socket

  //projects ideas: tothpick, calculator, wordfinder, boids, chess(kübel)
  //nostalgia, terraria, car driver, transpiler
  v1 articles
  v1.1.1 7segment
  v1.1.2 WWE
  v1.2.1 Refactored routes
  v1.2.2 Refactored all :-)
  v1.3.1 Chess Started
  v1.3.1.2 createCardRouter
  NCSC = non credo siano coincidenze
  CIGC = credo in gesù carota
*/

/*{
  "title": "Nostalgia!",
  "p": "My first 'game'",
  "path": "nostalgia"
}*/
