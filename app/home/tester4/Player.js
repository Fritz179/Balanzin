'use strict'

import Entity from '/libraries/fritz_4/Entity.js'
import PlayerController from './PlayerController.js'
import Sprite from '/libraries/fritz_4/Sprite.js'

class PlayerSprite extends Sprite {
  render() {
    const player = this.master
    const {x, y, w, h} = player

    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, w, h)
    this.canvas.style.left = x + 'px'
    this.canvas.style.top = y + 'px'
  }

  init(parent) {
    parent.appendChild(this.canvas)
  }
}

export default class Player extends Entity {
  constructor() {
    super(0, 0, 50, 50)

    this.addTrait(PlayerSprite)
    this.addTrait(PlayerController)
    // this.addTrait(RigidBody, '')

    this.speed = 10
  }

  init(parent) {
    this.traits.forEach(trait => {
      trait.init(parent)
    })
  }

  render(context) {
    this.getTrait(PlayerSprite).render(context)
  }

  update() {
    this.x += this.xv
    this.y += this.yv
  }
}
