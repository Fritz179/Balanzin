import Rect from './Rect.js'
import Events from './Events.js'

export default class Entity extends Rect {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this.xv = 0
    this.yv = 0

    this.traits = new Map()
    this.events = new Events()
  }

  addTrait(TraitClass, ...args) {
    const trait = new TraitClass(...args, this)
    trait.master = this

    this.traits.set(TraitClass, trait)
  }

  getTrait(TraitClass) {
    return this.traits.get(TraitClass)
  }
}
