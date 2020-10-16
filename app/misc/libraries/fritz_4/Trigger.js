import {Trait} from './Entity.js'

export default class Trigger extends Trait {
  init(parent) {
    this.master.events.listen('trigger', (...args) => this.master.trigger(...args))
  }

  update() {
    console.log(this.master);
  }
}
