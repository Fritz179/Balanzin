class TriggerBox extends Block {
  constructor(body) {
    super()
    
    this.offPos = new Vec2(0, 0)
    this.offSize = new Vec2(0, 0) // x = w, y = h
    this.body = body
  }

  set(xOff, yOff, w, h) {
    this.offPos.set(xOff, yOff)

    if (w || h) {
      this.offSize.set(w, h)
    }
  }

  get x() { return this.body.x + this.offPos.x }
  get y() { return this.body.y + this.offPos.y }
  get w() { return this.offSize.x || this.body.w }
  get h() { return this.offSize.y || this.body.h }

  set x(x) { }
  set y(y) { }
  set w(w) { }
  set h(h) { }
}
