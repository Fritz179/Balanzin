import Entity from '/libraries/fritz_4/Entity.js'
import Trigger from '/libraries/fritz_4/Trigger.js'

export default class Blocky extends Entity {
  constructor(parent, x, y, w, h) {
    super(x, y, w, h)

    this.addTrait(Trigger)
  }

  trigger(to) {
    console.log(to);
  }

  render(ctx) {
    ctx.fillStyle = '#AAA'
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
}
