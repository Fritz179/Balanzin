import Rect from './Rect.js'

export default class Entity extends Rect {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this.xv = 0
    this.yv = 0

    this.traits = new Map()
  }

  addTrait(TraitClass, ...options) {
    const trait = new TraitClass(this, ...options)
    trait.master = this
    this.traits.set(TraitClass, trait)
  }

  getTrait(TraitClass) {
    return this.traits.get(TraitClass)
  }

  removeTrait() {

  }
}

export class Trait {
  constructor(master, ...options) {

  }

  init(player) {
    abstract;
  }

  terminate(parent) {

  }
}
