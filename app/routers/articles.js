const express = require('express');
const router = express.Router()

const Article = require('../models/Article');
const User = require('../models/User');

const checkErrors = require('../models/checkErrors')
const {check, validationResult} = require('express-validator/check');

router.get('/', (req, res) => {
  Article.find({}, checkErrors(req, res, doc => {
    res.render('index', {articles: doc, title: 'Articles! by Fritz_179!'})
  }, () => {
    req.flash('danger', 'nothing found')
    res.render('index', {articles: [], title: 'Articles! by Fritz_179!'})
  }))
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_Article', {title: 'Add Article'})
})

router.post('/add', ensureAuthenticated, [
  check('title').not().isEmpty().withMessage('Title required'),
  //check('author').not().isEmpty().withMessage('Author required'),
  check('body').not().isEmpty().withMessage('Body required')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('add_Article', {title: 'Add Article', errors: errors.array()})
    return
  }

  const article = new Article({
    title: req.body.title,
    author: req.user._id,
    body: req.body.body
  }).save(err => {
    if (err) {
      console.log(err);
      return
    } else {
      req.flash("success", "Article Added");
      res.redirect('/articles')
    }
  })
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    console.log('55');
    if (article.author != req.user._id) {
      req.flash('danger', 'Not authorized')
      res.redirect('/')
    } else {
      res.render('edit_article', {title: 'Edit Article', article: article})
    }
  })
})

router.post('/edit/:id', ensureAuthenticated, [
  check('title').not().isEmpty().withMessage('Title required'),
  //check('author').not().isEmpty().withMessage('Author required'),
  check('body').not().isEmpty().withMessage('Body required')
], (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash('danger', errors.array()[0].msg )
    res.redirect('/articles/edit/' + req.params.id)
    return
  }
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err)
    };

    article.title = req.body.title
    article.body = req.body.body
    article.save((err, updatedTank) => {
      if (err) {
        console.log(err);
      }
      req.flash('success', 'Article Updated')
      res.redirect('/articles/' + req.params.id)
    });
});
  // const article = new Article({
  //   title: req.body.title,
  //   author: req.user._id,
  //   body: req.body.body
  // })
  // Article.updateOne({_id: req.params.id}, article, err => {
  //   if (err) {
  //     console.log(err);
  //     return
  //   } else {
  //     req.flash('success', 'Article Updated')
  //     res.redirect('/')
  //   }
  // })
})

router.delete('/:id', (req, res) => {
  if (!req.user) {
    req.flash('danger', 'Please log in')
    res.send('/users/login')
    return
  }

  Article.findById(req.params.id, (err, article) => {
    if (err) {
      req.flash('danger', 'Erur articles:102')
      res.send('/articles')
      return
    }
    if (article.author != req.user._id) {
      req.flash('danger', 'Invalid credentials')
      res.send('/articles')
      return
    } else if (article) {
      Article.deleteOne({_id: req.params.id}, err => {
        if (err) {
          console.log(err);
        } else {
          console.log('deleted: ' + req.params.id);
          req.flash('danger', 'Message Deleted')
          res.send('/articles')
        }
      })
    } else {
      console.log('Nisun articlu: ' + req.params.id);
      res.render('error', {error: 404})
    }
  })
})


//read single article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    let user = req.user ? req.user.id : '(not logged in)'
    console.log(`article request by ${user} for ${req.params.id} for ${article ? article.title : '(not valid)'}`);
    if (err) {
      console.log('erur: id miga valid');
      res.render('error', {error: 404})
    } else if (article) {
      User.findById(article.author, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          let username = 'ERUR => article.js:118'
          if (user) {
            username = user.username
          }
          res.render('article', {article: article, author: username})
        }
      })
    } else {
      console.log('Nisun articlu: ' + req.params.id);
      res.render('error', {error: 404})
    }
  })
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    if (req.method == 'DELETE') {
      req.method = 'GET'
    }
    req.flash('danger', 'Please log in!')
    res.redirect('/users/login');
  }
}

module.exports = router
