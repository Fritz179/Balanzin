import ChildCollider from './ChildCollider.js'

export default class Trigger {
  constructor(callback) {
    this.callback = callback
  }

  register(listen, entity, layer) {
    const callback = this.callback

    if (typeof callback == 'string') {
      return layer.events.fire('addTrigger', entity, (...args) => this.master.events.fire(callback, ...args))
    }

    if (typeof callback == 'function') {
      return layer.events.fire('addTrigger', entity, (...args) => callback(...args))
    }

    layer.events.fire('addTrigger', entity, () => { })
  }

  unregister() {
    console.log('unregister');
  }
}


export class TileCollider {
  constructor(callback) {
    this.callback = callback
  }

  register(listen, entity, layer) {
    const callback = this.callback

    if (typeof callback == 'string') {
      return layer.events.fire('addTileCollider', entity, (...args) => this.master.events.fire(callback, ...args))
    }

    if (typeof callback == 'function') {
      return layer.events.fire('addTileCollider', entity, (...args) => callback(...args))
    }

    layer.events.fire('addTileCollider', entity, () => { })
  }
}
