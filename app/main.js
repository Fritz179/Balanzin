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
    let projects = Projects.map(project => { return {name: project, src: `/home/${project}.png`, body: 'A p5 project!'}})
    cards = doc.concat(projects)
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

const Projects = ['Seven_Segment_Display']
const projects = Projects.map(project => project.toLowerCase())

app.get('/:name', (req, res, next) => {
  let name = req.params.name
  if (Projects.includes(name)) {
    res.render('projects/project', {projectName: name})
  } else {
    let index = projects.indexOf(req.params.name.toLowerCase())
    if (index != -1) {
      res.redirect('/' + Projects[index])
    } else {
      next()
    }
  }
})

app.get('*', (req, res) => {
  res.render('error', {error: 404})
})

const Server = app.listen(process.env.PORT || 1234, () => {
  console.log(`200: Server online on: http://localhost:${Server.address().port} !!`);
  io.attach(Server)
})

//tothpick, calculator, wordfinder, boids, chess, tris
//v1 articles
//v1.1.1 7segment
//v1.1.2 WWE
//v1.2.1 Refactored routes
//v1.2.2 Refactored all :-)
