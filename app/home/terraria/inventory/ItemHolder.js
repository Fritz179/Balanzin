class ItemHolder extends Canvas {
  constructor(background) {
    background ? super(background) : super()

    this.id = 0
    this.oldId = null
    this.quantity = 0
    this.oldQuantity = null
  }


  get changed() { return this.id != this.oldId || this.quantity != this.oldQuantity }
  get isEmpty() { return !this.id }

  set changed(bool) { }

  getFrom(other) {
    if (!this.isEmpty) throw new Error('What?')

    this.id = other.id
    this.quantity = other.quantity
    return other.empty()
  }

  dump(other) {
    other.id = this.id
    other.quantity = this.quantity
    return this.empty()
  }

  empty() {
    this.id = 0
    this.quantity = 0

    return this
  }

  remove(q = 1) {
    this.quantity -= q

    if (this.quantity <= 0) {
      return this.empty()
    }

    return this
  }
}
