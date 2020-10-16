'use strict'

import Entity from '/libraries/fritz_4/Entity.js'
import PlayerController from './PlayerController.js'
import Sprite from '/libraries/fritz_4/Sprite.js'
import Trigger from '/libraries/fritz_4/Trigger.js'

class PlayerSprite extends Sprite {
  render() {
    const player = this.master
    const {x, y, w, h, white} = player

    this.ctx.fillStyle = white ? '#F00' : '#000'
    this.ctx.fillRect(0, 0, w, h)
    this.canvas.style.left = x + 'px'
    this.canvas.style.top = y + 'px'
  }

  init(parent) {
    parent.appendChild(this.canvas)
  }
}

export default class Player extends Entity {
  constructor(parent, x, y) {
    super(x, y, 50, 50)

    this.addTrait(PlayerSprite)
    this.addTrait(PlayerController)
    this.addTrait(Trigger)

    this.speed = 10
    this.white = false
  }

  init(parent) {
    this.traits.forEach(trait => {
      trait.init(parent)
    })
  }

  trigger(to) {
    this.white = true
  }

  render(context) {
    this.getTrait(PlayerSprite).render(context)
    this.white = false
  }

  update() {
    this.x += this.xv
    this.y += this.yv
  }
}
