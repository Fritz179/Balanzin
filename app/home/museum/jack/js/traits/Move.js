import Trait from './Trait.js'

export default class Move extends Trait {
  constructor(level, x, y) {
    super("move")
    this.level = level
  }

  update(entity) {
    let axv = Math.abs(entity.xv)
    if (entity.dir != 0 && ((entity.xv / axv == entity.dir) || entity.xv == 0)) {
      entity.xv += entity.dir * entity.xa
      axv = Math.abs(entity.xv)
      entity.xv = (axv < entity.maxxv ? axv : entity.maxxv) * entity.xv / axv
    } else if (axv > entity.xda) {
      entity.xv -= entity.xv > 0 ? entity.xda : -entity.xda
    } else {
      entity.xv = 0
      entity.dist = 0
    }
    entity.dist += entity.xv
    if (entity.dir != 0) {
      entity.heading = entity.dir
    }
  }
}
