import Player from './Player.js'
import Timer from '/libraries/fritz_4/Timer.js'

const canvas = document.getElementById('screenCanvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

const player = new Player()
const div = document.getElementById('screenDiv')
player.init(div)

const timer = new Timer(60, () => {

  ctx.fillStyle = '#333'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  player.update(ctx)
  player.render(ctx)
})
