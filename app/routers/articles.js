const router = require('express').Router()

const checkErrors = require('../models/checkErrors')
const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator/check');

const Article = require('../models/Article');
const User = require('../models/User');

router.get('/', (req, res) => {
  Article.find({}, checkErrors(req, res, doc => {
    res.render('articles/index', {articles: doc})
  }, () => {
    req.flash('danger', 'nothing found')
    res.render('articles/index', {articles: [], title: 'Articles! by Fritz_179!'})
  }))
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('articles/add_Article')
})

router.post('/add', ensureAuthenticated, [
  check('title').not().isEmpty().withMessage('Title required'),
  //check('author').not().isEmpty().withMessage('Author required'),
  check('body').not().isEmpty().withMessage('Body required')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash('danger', errors.array()[0].msg)
    res.redirect('/articles/add')
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
      res.render('articles/edit_article', {article: article})
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
})

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, checkErrors(req, res, article => {
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
          res.redirect('/articles')
        }
      })
    }
  }))
})

//read single article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, checkErrors(req, res, article => {
    let user = req.user ? req.user.id : '(not logged in)'
    console.log(`article request by ${user} for ${article.title}`);

    User.findById(article.author, checkErrors(req, res, user => {
      username = user.username
      res.render('articles/article', {article: article, author: username})
    }))
  }))
})

module.exports = router

console.log('200: Articles ready to serve.');
