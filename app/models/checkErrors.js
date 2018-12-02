module.exports = (req, res, callback, notFound) => {
  return (err, doc) => {
    if (err) {
      console.log(err);
      req.flash('danger', 'error: ')
      res.redirect('/')
    } else if (!doc.length) {
      if (notFound) {
        console.log('nothing found (handled)')
        notFound()
      } else {
        console.log('nothing found')
        req.flash('danger', 'nothing found')
        res.redirect('/')
      }
    } else {
      callback(doc)
    }
  }
}
