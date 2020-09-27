const {join} = require('path')
const path = join(__dirname, '..')

module.exports = ({router}) => {
  function add(of, dir) {
    if (typeof dir != 'string') dir = of.slice(of.indexOf('.'))

    router.get('/' + dir, (req, res) => {
      res.sendFile(join(path, of))
    })
  }

  add('main.js', '')
  add('manifest.json')
  add('main.min.js', 'min')

  router.get('/manifest', (req, res) => {
    res.sendFile(join(path, 'manifest.json'))
  })
}
