const ensureAuthenticated = require('../../../../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator/check');
const {join} = require('path');

const Article = require('../../../../models/Article');

module.exports = ({router, directory, createRouter}) => {
  router.use('/', createRouter('/' + directory))

  router.get('/', (req, res) => {
    res.render(join(directory, 'index.ejs'))
  })
}
