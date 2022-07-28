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
    instagram: 'Fritz_179',
    snapchat: 'fritz_179'
  })

  add('gr', {
    title: 'Giorgio Rampa',
    whatsapp: '41786526771',
    instagram: 'rampa033',
    snapchat: 'xrampela',
  })

  add('ml', {
    title: 'Matteo Liver',
    whatsapp: '41796361289'
  })

  add('lc', {
    title: 'Luca Caspani',
    whatsapp: '393474027933'
  })

  router.use('/', (req, res) => {
    res.send('Salve! Quest link le niamo tacu a nient, scrivum sü whatsapp ca ta meti sü quel ca ta vos')
  })
}
