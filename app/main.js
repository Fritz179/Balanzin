require('dotenv').config();
//setup express
const path = require('path')
const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport');
const Card = require('./models/Card');

//start mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {useNewUrlParser: true}).then(() => {
  console.log('Connesso a MongoDB Atlas!');
}, err => {
  console.log(err);
})

//add body-parser
const bodyParser  = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//setup pug as view engine
let paths = []
let l = ['articles', 'users', 'home']
l.forEach(obj => {
  paths.push(path.join(__dirname, 'views/' + obj))
})
app.set('views', paths)
app.set('view engine', 'ejs')
app.engine('pug', require('pug').__express);
//app.engine('ejs', require('ejs').__express);

app.use(express.static(path.join(__dirname, 'public')))

// express-session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

require('./config/passport')(passport)

app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

app.get('/', (req, res) => {
  Card.find({}, (err, cards) => {
    if (err) {
      res.send('Nope')
      console.log(err);
    } else if (cards) {
      console.log(cards[0].redirect);
      res.render('home', {cards: cards})
    } else {
      res.send('Nope')
      console.log('Nope');
    }
  })
})

// app.get('/save', (req, res) => {
//   const card = new Card({
//     {title: 'Articles', body:'Read and write articles', src: 'img/articles.png', redirect:'articles'}
//     body:'Read and write articles',
//     src: 'img/articles.png'
//   }).save(err => {
//     if (err) {
//       console.log(err);
//       return
//     } else {
//       req.flash("success", "Saved?");
//       res.redirect('/')
//     }
//   })
// })

const articles = require('./routers/articles.js')
app.use('/articles', articles)

const users = require('./routers/users.js')
app.use('/users', users)

const Server = app.listen(process.env.PORT || 1234, () => {
  console.log(`Server online on: http://localhost:${Server.address().port} !!`);
})
