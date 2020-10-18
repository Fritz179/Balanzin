import ChildCollider from './ChildCollider.js'

export default class Trigger {
  constructor(callback) {
    this.callback = callback
  }

  register(listen, entity, layer) {
    const callback = this.callback

    if (typeof callback == 'string') {
      return layer.getTrait(ChildCollider).registerTrigger(this.master, (...args) => this.master.events.fire(callback, ...args))
    }

    if (typeof callback == 'function') {
      return layer.getTrait(ChildCollider).registerTrigger(this.master, callback)
    }

    layer.getTrait(ChildCollider).registerTrigger(this.master, () => {})
  }

  unregister() {
    console.log('unregister');
  }
}
