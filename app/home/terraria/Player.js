class Player extends Entity {
  constructor(x, y, status) {
    console.log(x, y, status);
    super()
    // this.setSize(15, 24)
    this.setSize(24, 40)
    this.setSize(15, 24)
    this.setPos(x, y)

    status.camera.follow(this)
    this.listen('key')
    this.collideWithMap()
    this.setAcc(0, 0.1)
    // this.collideWith(['bullet', 'end', 'shooter'])

    this.speed = 3
    this.jumpingForce = 4
    this.movingDir = 0
    this.dir = 0
    this.movingDist = 0
  }

  onKey(input) {
    switch (input) {
      case 'x': this.collideWithMap(false); break;
      case 'c': console.log(`isInGround: ${this.isOnGround}`); break;
      case ' ': if (this.isOnGround || debugEnabled) this.setVel(this.xv, -this.jumpingForce); break;
      case 'left': this.movingDir--; break;
      case 'right': this.movingDir++; break;
      case 'p': console.log(this.x, this.y, this.xv, this.yv, this.realX, this.realY); break;
      case 'Escape': setCurrentStatus('mainMenu'); break;
    }
  }

  update() {
    if (this.xv > 0) this.dir = 0
    else if (this.xv < 0) this.dir = 1

    if (this.xv) {
      if (this.movingDist > 0 != this.xv > 0) this.movingDist = 0
      this.movingDist += this.xv / 10
    } else {
      this.movingDist = 0
    }

    this.xv = this.movingDir * this.speed
  }

  onKeyReleased(input) {
    switch (input) {
      case 'x': this.collideWithMap(true); break;
      case 'left': this.movingDir++; break;
      case 'right': this.movingDir--; break;
    }
  }

  onCollision({collider, stopCollision, stopOtherCollision}) {
    switch (collider.name) {
      case 'bullet': console.log('damaged'); break;
      case 'end': setCurrentStatus('levelSelection'); break;
      default: console.log('colliding with', collider.name, collider);
    }
  }

  getSprite() {
    if (!this.isOnGround) {
      if (abs(this.yv) < this.jumpingForce) return this.sprite.jump[1][this.dir]
      else return this.sprite.jump[this.yv > 0 ? 0 : 2][this.dir]
    }
    else if (this.movingDist) return this.sprite.run[floor(abs(this.movingDist % 10))][this.dir]
    else return this.sprite.idle[this.dir]
  }
}

class End extends Entity {
  constructor(x, y) {
    super()
    this.setPos(x * 16, y * 16)
    this.setSize(16, 16)
    this.lifetime = 0
    this.maxLifetime = 20
  }

  update() {
    this.lifetime++
    if (this.lifetime >= this.maxLifetime) this.lifetime = 0
  }

  onCollision({stopCollision}) { stopCollision() }

  getSprite() {
    return this.sprite.idle[floor(this.lifetime / this.maxLifetime * this.sprite.idle.length)]
  }
}
