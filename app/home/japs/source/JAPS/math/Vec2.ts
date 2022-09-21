export default class Vec2 {
  x: number
  y: number

  constructor()
  constructor(x: Vec2)
  constructor(x: number)
  constructor(x: number, y: number)
  constructor(x?: number | Vec2, y?: number) {
    if (typeof x == 'number') {
      if (typeof y == 'number') {
        this.x = x
        this.y = y
        return
      }

      this.x = x
      this.y = x
      return
    }

    if (x instanceof Vec2) {
      this.x = x.x
      this.y = x.y
      return
    }

    this.x = 0
    this.y = 0
  }

  add(x: Vec2): Vec2
  add(x: number): Vec2
  add(x: number, y: number): Vec2
  add(x: number | Vec2, y?: number): Vec2 {
    if (typeof x == 'number') {
      if (typeof y == 'number') {
        this.x += x
        this.y += y
        return this
      }

      this.x += x
      this.y += x
      return this
    }

    this.x += x.x
    this.y += x.y
    return this
  }

  sub(x: Vec2): Vec2
  sub(x: number): Vec2
  sub(x: number, y: number): Vec2
  sub(x: number | Vec2, y?: number): Vec2 {
    if (typeof x == 'number') {
      if (typeof y == 'number') {
        this.x -= x
        this.y -= y
        return this
      }

      this.x -= x
      this.y -= x
      return this
    }

    this.x -= x.x
    this.y -= x.y
    return this
  }

  mul(x: Vec2): Vec2
  mul(x: number): Vec2
  mul(x: number, y: number): Vec2
  mul(x: number | Vec2, y?: number): Vec2 {
    if (typeof x == 'number') {
      if (typeof y == 'number') {
        this.x *= x
        this.y *= y
        return this
      }

      this.x *= x
      this.y *= x
      return this
    }

    this.x *= x.x
    this.y *= x.y
    return this
  }

  div(x: Vec2): Vec2
  div(x: number): Vec2
  div(x: number, y: number): Vec2
  div(x: number | Vec2, y?: number): Vec2 {
    if (typeof x == 'number') {
      if (typeof y == 'number') {
        this.x /= x
        this.y /= y
        return this
      }

      this.x /= x
      this.y /= x
      return this
    }

    this.x /= x.x
    this.y /= x.y
    return this
  }

  set(x: Vec2): Vec2
  set(x: number): Vec2
  set(x: number, y: number): Vec2
  set(x: number | Vec2, y?: number): Vec2 {
    if (typeof x == 'number') {
      if (typeof y == 'number') {
        this.x = x
        this.y = y
        return this
      }

      this.x = x
      this.y = x
      return this
    }

    this.x = x.x
    this.y = x.y
    return this
  }
}

const Normals = {
  up:    new Vec2(0, -1),
  right: new Vec2(1,  0),
  down:  new Vec2(0,  1),
  left:  new Vec2(-1, 0)
}

export {
  Normals
}
