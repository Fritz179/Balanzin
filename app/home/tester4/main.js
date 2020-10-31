import Player from './Player.js'
import Blocky from './Blocky.js'
import TileLayer from './TileLayer.js'
import ChildCollider from '/libraries/fritz_4/traits/ChildCollider.js'
import HTMLDiv from '/libraries/fritz_4/traits/HTMLDiv.js'
import Children from '/libraries/fritz_4/traits/Children.js'
import Sprite from '/libraries/fritz_4/traits/Sprite.js'
import Timer from '/libraries/fritz_4/traits/Timer.js'
import Entity from '/libraries/fritz_4/Entity.js'

const hexVals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
function randomHex() {
  return hexVals[Math.floor(Math.random() * 16)]
}

function randomColor() {
  const r = randomHex
  return `#${r()}${r()}${r()}`
}

class BackGroundLayer extends Entity {
  register(listen, master) {
    this.addTrait(HTMLDiv)
    this.addTrait(Children)

    this.div.style.transform = `scale(2)`
    this.events.listen('render', this.render.bind(this), true)
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.addTrait(Sprite)

    window.addEventListener('resize', () => {
      this.w = window.innerWidth
      this.h = window.innerHeight
    })

    listen('addTrigger', (...args) => master.events.fire('addTrigger', ...args))

    this.children.add(Blocky, 100, 100, 200, 100, randomColor())
    this.children.add(Blocky, 600, 800, 100, 500, randomColor())
    this.children.add(Blocky, 200, 600, 600, 150, randomColor())
    this.children.add(Blocky, 1200, 200, 300, 300, randomColor())
    this.children.add(Blocky, 1050, 700, 100, 200, randomColor())
    this.children.add(Blocky, 600, 300, 500, 50, randomColor())
  }

  render() {
    // this.ctx.fillStyle = '#333'
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

class EntityLayer extends Entity {
  register(listen, master) {
    this.addTrait(HTMLDiv)
    this.addTrait(Children)

    this.div.style.transform = `scale(2)`

    listen('addTileCollider', (...args) => master.events.fire('addTileCollider', ...args))
    listen('addTrigger', (...args) => master.events.fire('addTrigger', ...args))

    master.player = this.children.add(Player, 500, 500)
  }
}

window.app = new class Tester4 extends Entity {
  constructor() {
    super()

    this.addTrait(HTMLDiv, 'screen')
    this.addTrait(Children)
    this.addTrait(ChildCollider)
    this.addTrait(Timer)
  }

  register(listen, parent) {
    listen('update', this.update.bind(this))

    this.children.add(TileLayer)
    this.children.add(BackGroundLayer)
    this.children.add(EntityLayer)
  }

  update() {
    this.div.style.left = -this.player.x * 2 + Math.ceil(window.innerWidth / 2) + 'px'
    this.div.style.top = -this.player.y * 2 + Math.ceil(window.innerHeight / 2) + 'px'
  }
}
