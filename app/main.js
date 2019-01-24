require('dotenv').config();

//setup express
const app = require('express')()
const io = require('socket.io')()
require('./setup/express.js')(app, io, __dirname)

//createCardRouter(string route, bool if neds authentication, bool if needs to handle paths with project, io)
const createCardRouter = require('./routers/createCardRouter');

//connect to mongoDB Atlas with mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {useNewUrlParser: true}).then(() => {
  console.log('200: Connection with mongoDB Atlas established.');
}, err => {
  console.error('503: Connection with mongoDB Atlas failed!.');
  console.error('503: Es tacu al wifi? (bambursa)');
})

//connect homepage with all cards
app.use('/', createCardRouter('home'))

//connect all intermidied routes (createCardRouter)
const sockets = ['wwe', 'chess'].forEach(route => {
  app.use('/' + route, createCardRouter(route, io))
})

//connect all routes that require an advanced routing system
const routes = ['articles', 'users', 'admin'].forEach(route => {
  const router = require(`./routers/${route}.js`)
  app.use('/' + route, router)
})

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
  //todo: fix bug, iframe rewuest ending in 404 with a second header (loopable), check all have /puclic, change footer.ejs

  //projects ideas: tothpick, calculator, wordfinder, boids, chess(kübel), tris, nostalgia, terraria
  v1 articles
  v1.1.1 7segment
  v1.1.2 WWE
  v1.2.1 Refactored routes
  v1.2.2 Refactored all :-)
  v1.3.1 Chess Started
  v1.3.1.2 createCardRouter
  NCSC = non credo siano coincidenze
  CIGC = credo in gesù carota

  remove unused models (User and articles in use)
*/
