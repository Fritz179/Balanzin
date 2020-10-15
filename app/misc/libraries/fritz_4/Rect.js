export default class Rect {
  constructor(x = 0, y = 0, w = 100, h = 100) {
    this.pos = new Vec2(x, y)
    this.size = new Vec2(w, h)
  }

  get x() { return this.pos.x }
  get y() { return this.pos.y }

  set x(x) { this.pos.x = x }
  set y(y) { this.pos.y = y }

  get w() { return this.size.x }
  get h() { return this.size.y }

  set w(x) { this.size.x = x }
  set h(y) { this.size.y = y }

  get top() { return this.pos.y }
  get left() { return this.pos.x }
  get right() { return this.pos.x + this.size.x }
  get bottom() { return this.pos.y + this.size.y }

  set top(y) { this.pos.y = y }
  set left(x) { this.pos.x = x }
  set right(x) { this.pos.x = x - this.size.x }
  set bottom(y) { this.pos.y = y - this.size.y }
}

function getVec(x, y) {
  if (Array.isArray(x)) return x
  if (x instanceof Vec2) return [x.x, x.y]
  if (typeof y != 'number') y = x

  return [x, y]
}

class Vec2 {
  constructor(x, y) {
    [x, y] = getVec(x, y)

    this.x = x
    this.y = y
  }

  add(x, y) {
    [x, y] = getVec(x, y)

    this.x += x
    this.y += y
  }
}
