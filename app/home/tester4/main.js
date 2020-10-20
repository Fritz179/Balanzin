import Player from './Player.js'
import Blocky from './Blocky.js'
import App, {Layer} from '/libraries/fritz_4/App.js'
import Trigger from '/libraries/fritz_4/Trigger.js'
import ChildCollider from '/libraries/fritz_4/ChildCollider.js'
import Sprite from '/libraries/fritz_4/Sprite.js'

const hexVals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
function randomHex() {
  return hexVals[Math.floor(Math.random() * 16)]
}

function randomColor() {
  const r = randomHex
  return `#${r()}${r()}${r()}`
}

class BackGroundLayer extends Layer {
  register(listen, master) {
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.addTrait(Sprite)

    listen('render')
    listen('addTrigger', (...args) => master.events.fire('addTrigger', ...args))

    this.addChild(Blocky, 100, 100, 200, 100, randomColor())
    this.addChild(Blocky, 600, 800, 100, 500, randomColor())
    this.addChild(Blocky, 200, 600, 600, 150, randomColor())
    this.addChild(Blocky, 1200, 200, 300, 300, randomColor())
    this.addChild(Blocky, 1050, 700, 100, 200, randomColor())
    this.addChild(Blocky, 600, 300, 500, 50, randomColor())
  }

  render() {
    this.ctx.fillStyle = '#333'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.children.forEach(set => {
      set.forEach(child => {
        child.events.fire('render', this.ctx)
      })
    })
  }
}

new class Tester4 extends App {
  register(listen, parent) {
    this.addTrait(ChildCollider)

    this.addChild(BackGroundLayer)
    this.player = this.addChild(Player, 500, 500)
  }
}
