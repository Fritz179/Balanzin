module.exports = ({router}) => {
  router.get('/', (req, res) => {
    res.send('select')
  })

  router.get('/play', (req, res) => {
    res.send('play')
  })
}
