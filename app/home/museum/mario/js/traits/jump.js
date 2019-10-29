import {trait} from '../entity.js'

export default class jump extends trait{
  constructor() {
    super('jump')
    this.duration = 0.3
    this.velocity = 200
    this.engageTime = 0
    this.ready = 0
    this.requestTime = 0
    this.gracePeriod = 0.1
    this.speedBoost = 0.3
  }

  start() {
    this.requestTime = this.gracePeriod
  }

  get falling() {
    return this.ready < 0
  }

  cancel() {
    this.engageTime = 0
  }

  obstruct(entity, side) {
    if (side == 'bottom') {
      this.ready = 1
    } else if (side == 'top') {
      this.cancel()
    }
  }

  update(entity, deltaTime) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration
        this.requestTime = 0
      }
      this.requestTime -= deltaTime
    }
    if (this.engageTime > 0) {
      entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost)
      this.engageTime -= deltaTime
    }

    this.ready--
  }
}
