const checkErrors = require('../../../models/checkErrors')
const ensureAuthenticated = require('../../../setup/ensureAuthenticated');
const {join} = require('path');

const Article = require('../../../models/Article');

module.exports = ({router, directory, createRouter}) => {
  router.use('/', createRouter(`/${directory}`))

  router.get('/', (req, res) => {
    Article.find({}, checkErrors(req, res, doc => {
      res.render(join(directory, 'index.ejs'), {articles: doc})
    }, () => {
      req.flash('danger', 'nothing found')
      res.render('articles/index', {articles: []})
    }))
  })
}
