module.exports = ({router}) => {
  router.get('*', (req, res) => {
    req.logout()
    req.flash('success', 'You are logged out')
    res.redirect('/users/login')
  })
}
