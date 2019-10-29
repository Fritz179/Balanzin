import {trait} from '../entity.js'

export default class go extends trait{
  constructor() {
    super('go')
    this.dir = 0
    this.acc = 400
    this.dist = 0
    this.heading = 0
    this.dragFactor = 1/1000
    this.decel = 300
  }

  update(entity, deltaTime) {

    const absX = Math.abs(entity.vel.x)

    if (this.dir) {
      entity.vel.x += this.acc * this.dir * deltaTime
      if (entity.jump) {
        if (!entity.jump.falling) {
          this.heading = this.dir == 1 ? 0 : 1
        }
      } else {
        this.heading = this.dir == 1 ? 0 : 1
      }
    } else if (entity.vel.x) {
      const dec = Math.min(absX, this.decel * deltaTime)
      entity.vel.x += entity.vel.x > 0 ? -dec : dec
    } else {
      this.dist = 0
      this.vel = 0
    }

    this.dist += absX * deltaTime
    const drag = this.dragFactor * entity.vel.x * absX
    entity.vel.x -= drag
  }
}
