import Entity from '/libraries/fritz_4/Entity.js'
import Trigger from '/libraries/fritz_4/Trigger.js'

export default class Blocky extends Entity {
  static tags = ['enemy']

  constructor(x, y, w, h, color) {
    super(x, y, w, h)

    this.color = color
    this.addTrait(Trigger)
  }

  register(listen){
    listen('render')
  }

  render(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
}
