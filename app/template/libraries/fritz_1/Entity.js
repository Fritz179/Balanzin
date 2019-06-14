class Master {
  constructor() {
    this.x = this.y = 0
    this.xv = this.yv = 0
    this.xa = this.ya = 0
    this.w = this.h = 16
    this.w2 = this.h2 = 0
    this.w3 = this.h3 = 0

    this._getRealX = this._getRealY = pos => pos;
    this._status = this._ecs = null
    this._collideWithMap = false
    this._toCollideWith = []
    this.name = deCapitalize(this.constructor.name)

    this._toListenFor = []
    this.sprite = null
  }

  setPos(x, y) { this.x = x; this.y = y; return this }
  setCenter(x, y) { this.xc = x; this.yc = y; return this }
  setVel(xv, yv) { this.xv = xv; this.yv = yv; return this }
  setAcc(xa, ya) { this.xa = xa; this.ya = ya; return this }
  setSize(w, h) { this.w = w; this.h = h; return this }
  setCord({x1, y1, x2, y2}) { this.x = x1; this.y = y1; return this.setSize(x2 - x1, y2 - y1) }
  setDiff(w2, h2) { this.w2 = w2, this.h2 = h2; return this}
  setSpriteSize(w3, h3) { this.w3 = w3, this.h3 = h3; return this}

  addVel(xv, yv) { this.xv += xv; this.yv += yv; return this  }

  update() { }
  fixedUpdate() { }

  get x1() { return this.x }
  get y1() { return this.y }
  get x2() { return this.x + this.w }
  get y2() { return this.y + this.h }
  get xc() { return this.x + this.w / 2 }
  get yc() { return this.y + this.h / 2 }
  get center() { return {x: this.xc, y: this.yc} }

  get realX() { return this._getRealX(this.x1) }
  get realY() { return this._getRealY(this.y1) }
  get realX2() { return this._getRealX(this.x2) }
  get realY2() { return this._getRealY(this.y2) }

  get w1() { return this.w }
  get h1() { return this.h }
  get x3() { return this.x + this.w2 }
  get y3() { return this.y + this.h2 }

  set x1(x) { this.x = x }
  set y1(y) { this.y = y }
  set x2(x) { this.x = x - this.w }
  set y2(y) { this.y = y - this.h }
  set xc(x) { this.x = x - this.w / 2 }
  set yc(y) { this.y = y - this.h / 2 }
  set center({x, y}) { this.xc = x, this.yc = y }

  set w1(w) { this.w = w }
  set h1(h) { this.h = h }
  set x3(x) { this.x = w - this.w2 }
  set y3(y) { this.y = h - this.h2 }

  get mouseX() { return this._mouseX() || 0 }
  get mouseY() { return this._mouseY() || 0 }
  get pmouseX() { return this._pmouseX() || 0 }
  get pmouseY() { return this._pmouseY() || 0 }

  _mouseX() { }
  _mouseY() { }
  _pmouseX() { }
  _pmouseY() { }

  collideWithMap(bool = true) { this._collideWithMap = bool }

  listen(...toListen) { this._toListenFor = this._toListenFor.concat(toListen) }
  setSprite(sprite) { this.sprite = sprite }
  getSprite() { return this.sprite }
}

class Entity extends Master {
  constructor() {
    super()

    this._killed = false
    this.sprite = sprites[this.name] || createDefaultTexture()
  }

  die() { this.killed = true; this._ecs.entitiesToKill.set(this, false) }

  changeType(type) {
    this.killed = true
    this._ecs.entitiesToKill.set(this, type)
  }

  collideWith(arr) { this._toCollideWith = arr }

  onCollision() { }

  _onMapCollision(side, x, y, s) {
    // if (debugEnabled) console.log(side, x, y, s, typeof this.onMapCollision == 'function');

    if (typeof this.onMapCollision == 'function') {
      this.onMapCollision({solveCollision: solveCollision.bind(this), side, x, y, s})
    } else {
      solveCollision.call(this)
    }

    function solveCollision() {
      switch (side) {
        case 'top': this.y1 = (y + 1) * s; this.yv = 0; break;
        case 'right': this.x2 = x * s; this.xv = 0; break;
        case 'bottom': this.y2 = y * s; this.yv = 0; break;
        case 'left': this.x1 = (x + 1) * s; this.xv = 0; break;
        default: throw new Error('invalid collision side', side, x, y, s, this)
      }
    }
  }

  get isMoving() { return this.xv || this.yv }
  get isOnGround() {
    const tiles = [...getIntersectingTiles({x1: this.x1, x2: this.x2, y1: this.y2, y2: this.y2}, this._status)]
    return tiles.some(t => [1, 2, 3].includes(t))
  }
  get isOn() { console.log('// TODO: isOn'); }
}

p5.prototype.Master = Master
p5.prototype.Entity = Entity
