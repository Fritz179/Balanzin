import Trait from './Trait.js'

export default class Phisics extends Trait {
  constructor(level) {
    super("phisics")
    this.level = level
    this.tileCollider = level.tileCollider
  }

  update(entity) {    
    entity.x += entity.xv
    this.tileCollider.checkX(entity);
    entity.y += entity.yv;
    this.tileCollider.checkY(entity);
    entity.yv += entity.ya;
    //entity.yv = entity.yv < entity.maxyv ? entity.yv : entity.maxyv
  }
}
