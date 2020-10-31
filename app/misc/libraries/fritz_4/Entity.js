import Rect from './Rect.js'
import Events from './Events.js'

export default class Frame extends Rect {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this.traits = new Map()
    this.events = new Events()

    if (this.register)
      this.events.listen('register', this.register.bind(this))
  }

  addTrait(TraitClass, ...args) {
    const trait = new TraitClass(...args, this)

    trait.master = this

    if (trait.register) {
      this.events.listen('register', (listen, ...args) => trait.register(listen, this, ...args))
    }

    this.traits.set(TraitClass, trait)
  }

  getTrait(TraitClass) {
    return this.traits.get(TraitClass)
  }
}
