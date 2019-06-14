class Player extends Entity {
  constructor(x, y, status) {
    super()
    this.setSize(16, 16)
    this.setPos(x, y)
    this.speed = 15
    // this.setVel(this.speed, this.speed)
    this.setVel(0, 0)
    this.collideWithMap()
    this.spriteDir = 0
    status.camera.follow(this)
    this.listen('onKey')
    this.collideWith(['bullet', 'end', 'shooter'])
  }

  onKey(input) {
    switch (input) {
      case 'up': if (!this.isMoving) { this.setVel(0, -this.speed); this.spriteDir = 2; } break;
      case 'right': if (!this.isMoving) { this.setVel(this.speed, 0); this.spriteDir = 3; } break;
      case 'down': if (!this.isMoving) { this.setVel(0, this.speed); this.spriteDir = 0; } break;
      case 'left': if (!this.isMoving) { this.setVel(-this.speed, 0); this.spriteDir = 1; } break;
      case 'p': console.log(this.x, this.y, this.xv, this.yv, this.realX, this.realY); break;
      case 'Escape': setCurrentStatus('mainMenu'); break;
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
    return this.sprite.idle[this.spriteDir]
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
    this.lifetime ++
    if (this.lifetime >= this.maxLifetime) this.lifetime = 0
  }

  onCollision({stopCollision}) { stopCollision() }

  getSprite() {
    return this.sprite.idle[floor(this.lifetime / this.maxLifetime * this.sprite.idle.length)]
  }
}
