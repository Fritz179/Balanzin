class Player extends Entity {
  constructor(x, y) {
    super(x, y)
    this.setSize(16, 16)
    this.setSprite('player')

    this.spriteAction = 'idle'
    this.speed = 15
    this.collideWithMap = true
    this.livingFor = 0
    this.wiggleTime = 15

  }

  fixedUpdate({updatePhisics}) {
    updatePhisics()

    this.livingFor++
  }

  update() {
    this.spriteFrame = this.livingFor % this.wiggleTime > this.wiggleTime / 2 ? 1 : 0
  }

  onEntityCollision({name, entity}) {
    if (name == 'Bullet') {

    }
  }

  onBlockCollision({x, y, solveCollision}) {
    if (this.breakBlock) {
      this.layer.setTileAt(x, y, 0)
    } else {
      solveCollision()
    }
  }

  onKey({name}) {
    if (!this.xv && !this.yv) {
      switch (name) {
        case 'up': this.setVel(0, -this.speed); this.dir = 2; break;
        case 'down': this.setVel(0, this.speed); this.dir = 0; break;
        case 'left': this.setVel(-this.speed, 0); this.dir = 1; break;
        case 'right': this.setVel(this.speed, 0); this.dir = 3; break;
      }
    }
  }

  move(xs, ys) {
    if (!this.xv && !this.yv) {
      this.setVel(xs * this.speed, ys * this.speed)
    }
  }

  getSprite() {
    if (this.xv || this.yv) {
      return sprites.player.moving[this.spriteFrame][this.dir]
    } else {
      return sprites.player.idle[this.spriteFrame][this.dir]
    }
  }
}

class End extends Entity {
  constructor([x, y]) {
    super()
    this.setPos(x * 16, y * 16)
    this.setSize(16, 16)
    this.livingFor = 0
    this.wiggleTime = 6

    this.setSprite('end')
  }

  update() {
    this.livingFor++
    this.spriteFrame = floor(this.livingFor / this.wiggleTime) % this.sprite.length
  }

  getSprite() {
    return this.sprite[this.spriteFrame]
  }
}
