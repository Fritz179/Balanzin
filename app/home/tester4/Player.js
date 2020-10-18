import Entity from '/libraries/fritz_4/Entity.js'
import PlayerController from './PlayerController.js'
import Sprite from '/libraries/fritz_4/Sprite.js'
import Trigger from '/libraries/fritz_4/Trigger.js'

class PlayerSprite extends Sprite {
  constructor() {
    super()

    this.color = '#000'
    this.lastCollision = null
  }

  register(listen) {
    const parent = document.getElementById('screenDiv')
    listen('render', this.render.bind(this))
    listen('Trigger1', to => {
      if (this.lastCollision == to) return

      this.lastCollision = to
      const temp = this.color
      this.color = to.color
      to.color = temp
    })
    parent.appendChild(this.canvas)
  }

  render() {
    const {x, y, w, h} = this.master
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(0, 0, w, h)
    this.canvas.style.left = x + 'px'
    this.canvas.style.top = y + 'px'
  }
}

class BasePhysic {
  register(listen) {
    listen('update', () => this.update())
  }

  update() {
    this.master.x += this.master.xv
    this.master.y += this.master.yv
  }
}

export default class Player extends Entity {
  static tags = ['player']

  constructor(x, y) {
    super(x, y, 50, 50)

    this.addTrait(PlayerSprite)
    this.addTrait(PlayerController)
    this.addTrait(BasePhysic)
    this.addTrait(Trigger, 'Trigger1')

    this.speed = 10
  }
}
