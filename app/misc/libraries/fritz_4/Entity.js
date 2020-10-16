import Rect from './Rect.js'
import Events from './Events.js'

export default class Entity extends Rect {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this.xv = 0
    this.yv = 0

    this.traits = new Map()
    this.events = new Events()

    this.events.listen('update', (...args) => this.update(...args))
    this.events.listen('render', (...args) => this.render(...args))
  }

  addTrait(TraitClass, ...args) {
    const trait = new TraitClass(this, ...args)
    trait.master = this
    this.traits.set(TraitClass, trait)
  }

  getTrait(TraitClass) {
    return this.traits.get(TraitClass)
  }

  update() {

  }

  render() {

  }
}

export class Trait {
  constructor(master, ...args) {

  }

  init(player) {
    abstract;
  }

  update() {

  }

  terminate(parent) {

  }
}
