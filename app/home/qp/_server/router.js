const {join} = require('path')
const path = join(__dirname, '..')

module.exports = ({router}) => {
  function add(name, options) {
    router.get('/' + name, (req, res) => {
      res.render('qp/index.ejs', options)
    })
  }

  add('mc', {
    title: 'Miryam Crameri',
    whatsapp: '41787174633',
    instagram: 'miryamcrameri'
  })

  add('ap', {
    title: 'Ambra Paganini',
    whatsapp: '41791711040',
    instagram: 'ambra_paganini',
    snapchat: 'ambra_paganini4'
  })

  add('ss', {
    title: 'Sofia Sighinolfi',
    whatsapp: '41786461359',
    instagram: 'sofisighi',
    snapchat: 'sofisugus'
  })

  add('jc', {
    title: 'Jan Crameri',
    instagram: 'jancrameri',
    snapchat: 'jan_crameri'
  })

  add('oc', {
    title: 'Sposato ma non troppo',
    whatsapp: '41786119533'
  })

  add('fc', {
    title: 'Fabrizio Cortesi',
    whatsapp: '41797502936',
    instagram: 'Fritz_179',
    snapchat: 'fritz_179'
  })

  add('sl', {
    title: 'Silvio Lardi',
    whatsapp: '41787224025',
    instagram: 'silvio_lardi',
    snapchat: 'silvio.lardi'
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
