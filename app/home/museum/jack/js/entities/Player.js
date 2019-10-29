import Entity from '../Entity.js'
import Phisics from '../traits/Phisics.js'
import Move from '../traits/Move.js'
import Jump from '../traits/Jump.js'
import PlayerController from '../traits/PlayerController.js'

export default class Player extends Entity {
  constructor(x, y, level) {
    super(x, y, "jack", level)

    this.cjoob = true
    this.h = 50
    this.w = 30

    this.addTrait(new Phisics(level))
    this.addTrait(new Move(level))
    this.addTrait(new Jump(level))
    this.addTrait(new PlayerController(this))
  }

  updateDrawing() {
    if (1) {
      this.status = 'walking'
    }
  }
}
