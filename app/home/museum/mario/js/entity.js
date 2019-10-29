import {vec2} from './math.js'

export class trait {
  constructor(name) {
    this.NAME = name
  }

  obstruct() {
    
  }

  update(deltaTime) {
    console.warn('no update trait', this.NAME)
  }
}


export default class entity {
  constructor() {
    this.pos = new vec2(0, 0)
    this.vel = new vec2(0, 0)
    this.size = new vec2(0, 0)
    this.traits = []
  }

  addTrait(trait) {
    this.traits.push(trait)
    this[trait.NAME] = trait
  }

  obstruct(side) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side)
    })
  }

  update(deltaTime) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime)
    })
  }
}
