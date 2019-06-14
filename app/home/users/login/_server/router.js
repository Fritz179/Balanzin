const path = require('path');
const {storeUser} = require('../../../../setup/storeUserBySessionId');
const passport = require('passport')

module.exports = ({router, directory}) => {
  router.get('/', (req, res) => {
    res.render(path.join(directory, 'index.ejs'), {from: req.query.from})
  })

  router.post('/', (req, res, next) => {
    passport.authenticate('local', {
      failureRedirect: req.originalUrl || '/users/login',
      failureFlash: true,
    })(req, res, next)
  }, storeUser, (req, res, next) => {
    const {from} = req.query
    res.redirect(from != 'undefined' ? from :  '/')
  })
}
