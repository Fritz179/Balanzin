export default class Event extends Map {
  listen(name, callback, first = false) {
    if (!this.get(name)) {
      this.set(name, new Set([callback]))
    } else if (first) {
      this.set(name, new Set([callback, ...this.get(name)]))
    } else {
      this.get(name).add(callback)
    }
  }

  fire(name, ...options) {
    const callbacks = this.get(name)
    if (!callbacks) return

    callbacks.forEach(callback => callback(...options))
  }

  getRegister(to) {
    return (name, fun, first) => {
      if (!fun) fun = to[name].bind(to)
      this.listen(name, fun, first)
    }
  }

  remove(callback) {
    const name = events.constructor

    return this.get(name)?.remove(callback)
  }
}
