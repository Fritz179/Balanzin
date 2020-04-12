require('dotenv').config();

//setup express
const app = require('express')()
const io = require('socket.io')()
const path = require('path')
require('./setup/express.js')(app, io, __dirname)

//connect to mongoDB Atlas with mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
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
    res.render('error', {code: 404, message: 'Not found!'})
  }
})

//connect Server to localhost
const Server = app.listen(process.env.PORT || 1234, () => {
  console.log(`200: Server online on: http://localhost:${Server.address().port} !!`);
  io.attach(Server)
})
