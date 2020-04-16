class Block {
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.pos = [x, y]
    this.size = [w, h]
  }

  set width(w) { this.w = w }
  set height(h) { this.h = h }

  get width() { return this.w }
  get height() { return this.h }

  //named
  get top() { return this.y }
  get left() { return this.x }
  get right() { return this.x + this.w }
  get bottom() { return this.y + this.h }

  get center() { return {x: this.x + this.w / 2, y: this.y + this.h / 2} }
  get frame() { return [this.x, this.y, this.w, this.h] }

  set top(y) { this.y = y }
  set left(x) { this.x = x }
  set right(x2) { this.x = x2 - this.w }
  set bottom(y2) { this.y = y2 - this.h }
}

addVec2(Block, 'pos', 'x', 'y')
addVec2(Block, 'size', 'w', 'h')
