export default class Entity {
  constructor(x = 0, y = 0, name = "defaultTexture", level) {
    this.level = level
    this.x = x
    this.y = y
    this.xv = 0
    this.yv = 0
    this.xa = 0.1
    this.ya = level.gravity
    this.maxxv = 20
    this.maxyv = 20
    this.xda = 0.2
    this.dir = 0
    this.heading = 1
    this.w = 0
    this.h = 0
    this.lifetime = 0;
    this.cjoob = false

    this.name = name
    this.status = "idle"
    this.frame = 0

    this.traits = [];
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  collides(candidate) {
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    });
  }

  obstruct(side, match) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side, match);
    });
  }

  draw() {

  }

  finalize() {
    this.traits.forEach(trait => {
      trait.finalize();
    });
  }

  update(level) {
    this.traits.forEach(trait => {
      trait.update(this, level);
    });

    this.lifetime += 1
  }
}
