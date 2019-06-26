const checkErrors = require('../../../../models/checkErrors')
const ensureAuthenticated = require('../../../../setup/ensureAuthenticated');
const {join} = require('path');

const Article = require('../../../../models/Article');
const User = require('../../../../models/User');

module.exports = ({router, directory, createRouter}) => {
  router.delete('/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, checkErrors(req, res, article => {
      if (article.author != req.user._id) {
        req.flash('danger', 'Invalid credentials')
        res.redirect('/users/login')
        return
      } else if (article) {
        Article.deleteOne({_id: req.params.id}, err => {
          if (err) {
            console.log(err);
          } else {
            console.log('410: deleted: ' + req.params.id);
            req.flash('danger', 'Message Deleted')
          }
        })
        res.send('/articles')
      }
    }))
  })

  //read single article
  router.get('/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, checkErrors(req, res, article => {
      let user = req.user ? req.user.username : '(not logged in)'
      console.log(`102: article requested by ${user} for ${article.title}`);

      User.findById(article.author, checkErrors(req, res, user => {
        res.render(join(directory, 'index.ejs'), {article: article, author: user.username})
      }))
    }))
  })
}
