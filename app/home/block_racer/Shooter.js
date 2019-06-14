class Shooter extends Entity {
  constructor(x, y, r) {
    super()
    this.setPos(x * 16, y * 16)
    this.r = r
    this.setSize(16, 16)
    this.lifetime = 0
    this.maxLifetime = 250
  }

  update() {
    this.lifetime ++
    if (this.lifetime >= this.maxLifetime) {
      this.lifetime = 0
      this._ecs.spawners.bullet(this.x, this.y + 8)
    }
  }

  getSprite() {
    return this.sprite.idle[floor(this.lifetime / this.maxLifetime * this.sprite.idle.length)][this.r]
  }


  onCollision({stopCollision}) {
    stopCollision()
  }

  onChuckUnload() {
    return [this.x, this.y, this.r]
  }

  onOffscreen() {
    return false
  }
}

class Bullet extends Entity {
  constructor(x, y) {
    super()
    this.setPos(x - 3, y - 3)
    this.setSize(6, 6)
    this.setVel(-5, 0)
    this.dying = false
    this.deadTime = 0
    this.maxDeadTime = 30
    this.collideWithMap()
  }

  update() {
    if (this.dying) {
      this.deadTime++
      if (this.deadTime >= this.maxDeadTime) {
        this.die()
      }
    }
  }

  onMapCollision({solveCollision}) {
    solveCollision()
    this.secondPhase()
  }

  getSprite() {
    if (!this.dying) {
      return this.sprite.idle
    } else {
      return this.sprite.dying[floor(this.deadTime / this.maxDeadTime * this.sprite.dying.length)]
    }
  }

  onCollision({stopCollision, stopOtherCollision}) {
    stopOtherCollision()
    this.secondPhase()
  }

  secondPhase() {
    this.changeType('bullet_dying')
    this.dying = true
    this.setSize(8, 16)
    this.setPos(this.x, this.y - 5)
  }

  onOffscreen() {
    return true
  }

  onChuckUnload() {
    return true
  }
}
