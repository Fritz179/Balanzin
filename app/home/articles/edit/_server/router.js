const ensureAuthenticated = require('../../../../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator');
const {join} = require('path');

const Article = require('../../../../models/Article');
const User = require('../../../../models/User');

module.exports = ({router, directory}) => {
  router.get('/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (err, article) => {
      if (article.author != req.user._id) {
        req.flash('danger', 'Not authorized')
        res.redirect('/articels')
      } else {
        res.render(join(directory, 'index.ejs'), {article: article})
      }
    })
  })

  router.post('/:id', ensureAuthenticated, [
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
      article.save((err, updatedArticle) => {
        if (err) {
          console.log(err);
        }
        req.flash('success', 'Article Updated')
        res.redirect('/articles/article/' + req.params.id)
      });
    });
  })

}
