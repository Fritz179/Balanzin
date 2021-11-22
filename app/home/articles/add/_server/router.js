const ensureAuthenticated = require('../../../../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator');
const {join} = require('path');

const Article = require('../../../../models/Article');

module.exports = ({router, directory}) => {
  router.get('/', ensureAuthenticated, (req, res) => {
    res.render(join(directory, 'index.ejs'))
  })

  router.post('/', ensureAuthenticated, [
    check('title').not().isEmpty().withMessage('Title required'),
    //check('author').not().isEmpty().withMessage('Author required'),
    check('body').not().isEmpty().withMessage('Body required')
  ], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      req.flash('danger', errors.array()[0].msg)
      res.redirect(join(directory, 'index.ejs'))
      return
    }

    const article = new Article({
      title: req.body.title,
      author: req.user._id,
      body: req.body.body
    }).save(err => {
      if (err) {
        return
      } else {
        req.flash("success", "Article Added");
        res.redirect('/articles')
      }
    })
  })

}
