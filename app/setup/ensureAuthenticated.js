module.exports = function ensureAuthenticated(req, res, next) {
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
