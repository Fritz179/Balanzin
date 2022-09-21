import Vec2 from '../Vec2.js'
import { Shape, ShapeTypes, Circle, Line, Point } from '../Shape.js'
import { assertUnreachable, assertUnimplemented } from '../../assert.js'

export default class Rect implements Shape {
  pos: Vec2
  size: Vec2

  constructor(x: number, y: number, w: number, h: number) {
    this.pos = new Vec2(x, y)
    this.size = new Vec2(w, h)
  }

  get x() { return this.pos.x }
  get y() { return this.pos.y }
  get w() { return this.size.x }
  get h() { return this.size.y }

  set x(x) { this.pos.x = x }
  set y(y) { this.pos.y = y }
  set w(w) { this.size.x = w }
  set h(h) { this.size.y = h }

  get x1() { return this.x }
  get y1() { return this.y }
  get x2() { return this.x + this.w }
  get y2() { return this.y + this.h }

  set x1(x) { this.x = x }
  set y1(y) { this.y = y }
  set x2(x) { this.x = x - this.w }
  set y2(y) { this.y = y - this.h }


  intersects(other: ShapeTypes) {
    if (other instanceof Rect) {
      return Rect.intersectsRect(this, other)
    }

    if (other instanceof Circle) {
      return Rect.intersectsCircle(this, other)
    }

    if (other instanceof Line) {
      return Rect.intersectsLine(this, other)
    }

    if (other instanceof Point) {
      return Rect.intersectsPoint(this, other)
    }

    assertUnreachable(other)
  }

  static intersectsRect(self: Rect, other: Rect): boolean {
    return !(
      self.x1 > other.x2 ||
      self.x2 < other.x1 ||
      self.y1 > other.y2 ||
      self.y2 < other.y1
    )
  }

  static intersectsCircle(rect: Rect, circle: Circle): never {
    assertUnimplemented('Rect vs Circle')
  }

  static intersectsLine(rect: Rect, line: Line, contact?: Point, normal?: Vec2): boolean {
    let nearX = (rect.x1 - line.x) / line.w
    let nearY = (rect.y1 - line.y) / line.h

    let farX = (rect.x2 - line.x) / line.w
    let farY = (rect.y2 - line.y) / line.h

    if (nearX > farX) [nearX, farX] = [farX, nearX]
    if (nearY > farY) [nearY, farY] = [farY, nearY]

    if (nearX > farY || nearY > farX) return false

    const near = Math.max(nearX, nearY)
    const far = Math.min(farX, farY)

    if (far < 0 || near > 1) return false

    if (contact) {
      contact.x = line.x + near * line.w
      contact.y = line.y + near * line.h
    }

    if (normal) {
      if (nearX > nearY) {
        if (line.w < 0) {
          normal.set(1, 0)
        } else {
          normal.set(-1, 0)
        }
      } else {
        if (line.h < 0) {
          normal.set(0, 1)
        } else {
          normal.set(0, -1)
        }
      }
    }

    return true
  }

  static intersectsPoint(self: Rect, other: Point): boolean {
    return !(
      self.x1 > other.x ||
      self.x2 < other.x ||
      self.y1 > other.y ||
      self.y2 < other.y
    )
  }
}