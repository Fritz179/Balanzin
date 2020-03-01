class Block {
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.pos = new posVec(x, y)
    this.w = w
    this.h = h
  }

  set x1(x) { this.x = x }
  set y1(y) { this.y = y }
  set x2(x2) { this.x = x2 - this.w }
  set y2(y2) { this.y = y2 - this.h }
  set width(w) { this.w = w }
  set height(h) { this.h = h }

  get x1() { return this.x }
  get y1() { return this.y }
  get x2() { return this.x + this.w }
  get y2() { return this.y + this.h }
  get width() { return this.w }
  get height() { return this.h }

  //named
  get top() { return this.y }
  get left() { return this.x }
  get right() { return this.x + this.w }
  get bottom() { return this.y + this.h }

  get center() { return {x: this.x + this.w / 2, y: this.y + this.h / 2} }
  get cord() { return {x1: this.x, y1: this.y, x2: this.x2, y2: this.y2} }
  get frame() { return [this.x, this.y, this.w, this.h] }

  set top(y) { this.y = y }
  set left(x) { this.x = x }
  set right(x2) { this.x = x2 - this.w }
  set bottom(y2) { this.y = y2 - this.h }
  set absTop(y) { this.h = this.y + this.h - y; this.y = y; }
  set absLeft(x) { this.w = this.x + this.w - x; this.x = x; }
  set absRight(x2) { this.w = x2 - this.x }
  set absBottom(y2) { this.h = y2 - this.y }

  set center({x, y}) { this.x = x - this.w / 2; this.y = y - this.h / 2 }
  set cord({x1, y1, x2, y2}) { this.x = x1; this.y = y1; this.w = x2 - x1; this.h = y2 - y1 }
  set frame([x, y, w, h]) { this.x = x; this.y = y; this.h = h; this.w = w; }

  setSize(w, h) { this.w = w; this.h = h; return this; }
  setAbsPos(x, y) { this.absLeft = x; this.absTop = y; return this; }
  setAbsSize(x2, y2) { this.w = x2 - this.x; this.h = y2 - this.y; return this; }
  setCenter(x, y) { this.x = x - this.w / 2; this.y = y - this.h / 2; return this; }
}

const posVec = addVec2(Block, 'pos', 'x', 'y')
// const sizeVec = addVec2(Block, 'size', 'w', 'h')
