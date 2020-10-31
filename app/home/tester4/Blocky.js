import Entity from '/libraries/fritz_4/Entity.js'
import Trigger from '/libraries/fritz_4/traits/Trigger.js'

export default class Blocky extends Entity {
  static tags = ['enemy']

  constructor(x, y, w, h, color) {
    super(x / 2, y / 2, w / 2, h / 2)

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
