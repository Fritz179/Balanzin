export default class Event {
  constructor() {
    this.events = new Map()
  }

  listen(name, callback) {
    if (!this.events.get(name)) {
      this.events.set(name, new Set([callback]))
    } else {
      this.events.get(name).add(callback)
    }
  }

  fire(name, ...options) {
    const callbacks = this.events.get(name)
    if (!callbacks) return

    callbacks.forEach(callback => callback(...options))
  }

  remove(callback) {
    const name = events.constructor

    return this.events.get(name)?.remove(callback)
  }
}
