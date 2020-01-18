class Drop extends Entity {
  constructor({x, y, id, quantity = 1, reloaded = false}) {
    super(x, y, 16 / 2, 16 / 2)

    this.setDrag(0.95, 0.99)

    if (!reloaded) {
      this.setVel(random(-5, 5), random(-6, -4))
    }

    this.maxLifeTime = 60 * 60
    this.lifeTime = this.maxLifeTime
    this.pickupTime = 10
    this.collideWithMap = true

    this.id = id
    this.quantity = quantity
    this.ya = 0.25

    this.triggerBox.set(-5, -5, 18, 18)
  }

  serialize() {
    return {x: this.x, y: this.y, id: this.id, quantity: this.quantity, reloaded: true}
  }

  onUnloadedChunk() {
    return this.serialize()
  }

  onEntityCollision({name, entity}) {
    if (name == 'Drop') {
      if (this.id == entity.id && entity.pickupTime < 0 && this.pickupTime < 0) {
        this.lifeTime = this.maxLifeTime
        this.quantity += entity.quantity
        this.setVel(random(-2, 2), random(-2.5, -1.5))
        this.pickupTime = 10
        entity.despawn()
      }
    }
  }

  fixedUpdate({updatePhisics}) {
    updatePhisics()

    if (!this.xv && !this.yv) {
      this.pickupTime--
    }
  }

  getSprite(ctx) {
    ctx.image(tiles[this.id].sprite, this.x, this.y, 16 / 2, 16 / 2)

    return false
  }
}
