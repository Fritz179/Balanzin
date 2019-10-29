import Trait from './Trait.js'

export default class Jump extends Trait {
  constructor(level) {
    super("jump")
    this.level = level
    this.canJump = false
    this.requestTime = 0
    this.pardon = 10
    this.holding = false
  }

  update(entity) {
    if (this.requestTime > 0) {
      if (this.canJump) {
        entity.yv = -10
        this.requestTime = 1
      } else if (!this.holding) {
        this.requestTime--
      }
    }
    this.canJump = false
  }

  request() {
    this.requestTime = this.pardon
    this.holding = true
  }

  stop() {
    console.log("stopped");
    this.holding = false
  }
}
