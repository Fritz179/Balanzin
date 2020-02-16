class Shooter extends Entity {
  constructor([x, y, r]) {
    super()
    this.setPos(x * 16, y * 16)
    this.r = r
    this.setSize(16, 16)
    this.livingFor = 0
    this.maxLifetime = 250

    this.setSprite('shooter')
  }

  update() {
    this.livingFor ++
    if (this.livingFor >= this.maxLifetime) {
      this.livingFor = 0
      const xs = [0, 1, 0, -1][this.r]
      const ys = [-1, 0, 1, 0][this.r]

      main.addChild(new Bullet(this.x + 8 + xs * 8, this.y + 8 + ys * 8, xs, ys, this.r))
    }

    this.spriteFrame = floor((this.livingFor / this.maxLifetime) * this.sprite.length)
  }

  getSprite() {
    return this.sprite[this.spriteFrame][this.r]
  }
}

class Bullet extends Entity {
  constructor(x, y, xs, ys, r) {
    super()
    this.setPos(x - 3, y - 3)
    this.setSize(6, 6)
    this.setVel(xs * 5, ys * 5)

    this.r = r

    this.setSprite('bullet')
    this.spriteAction = 'idle'
    this.deadTime = 0
    this.maxDeadTime = 30
    this.collideWithMap = true
  }

  update() {
    if (this.spriteAction == 'dying') {
      this.deadTime++


      if (this.deadTime >= this.maxDeadTime) {
        this.despawn()
      }

      this.spriteFrame = floor(this.deadTime / this.maxDeadTime * this.sprite.dying.length)
    }
  }

  onEntityCollision() {
    this.die()
  }

  onBlockCollision({solveCollision}) {
    this.die()
    solveCollision()
  }

  onUnloadedChunk({teleportToNearestChunk}) {
    teleportToNearestChunk()
    console.log('sadf');
    if (this.spriteAction != 'dying') {
      this.vel.set(0, 0)
      this.die()
    }
  }

  die() {
    this.spriteDir = (this.r + 1) % 4
    this.setPos(this.x + [-5, 8, -5, -8][this.r], this.y + [-8, -5, 8, -5][this.r])
    this.setSize([16, 8, 16, 8][this.r], [8, 16, 8, 16][this.r])
    this.spriteAction = 'dying'
  }
}
