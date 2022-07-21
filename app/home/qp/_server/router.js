const {join} = require('path')
const path = join(__dirname, '..')

module.exports = ({router}) => {
  function add(name, options) {
    router.get('/' + name, (req, res) => {
      res.render('qp/index.ejs', options)
    })
  }

  add('fc', {
    title: 'Fabrizio Cortesi',
    whatsapp: '41797502936',
    instagram: 'Fritz_179'
  })

  router.get('/', (req, res) => {
    res.send('Salve!')
  })
}
