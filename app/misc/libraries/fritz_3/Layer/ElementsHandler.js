/*
  Stores elements by type
*/

class ElementsHandler {
  constructor() {
    this.elements = new Set()
  }

  get types() { return Object.keys(this.elements) }
  get length() { return this.elements.size }

  add(element, type) {
    this.elements.add(element)

    if (this.elements[name]) {
      this.elements[name].add(element)
    } else {
      this.elements[name] = new Set([element])
    }
  }

  remove(element, type) {
    if (!this.elements[type]) {
      debugger
    }

    const elDel = this.elements.delete(element)
    console.assert(elDel, '\nCannot remove nonexistent element (ENOENT)\n', child)

    // don't check if it existed
    this.elements[type].delete(element)
  }

  clear() {
    this.elements = new Set()
  }

  forEach(fun) {
    this.elements.forEach(fun)
  }

  forEachType(fun) {
    this.types.forEach(fun)
  }
}
