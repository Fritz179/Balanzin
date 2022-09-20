import Vec2 from '../Vec2.js'
import { Shape, ShapeTypes, Rect, Circle, Line } from '../Shape.js'
import { assertUnreachable, assertUnimplemented } from '../../assert.js'

export default class Point implements Shape {
  pos: Vec2

  constructor(x: number, y: number) {
    this.pos = new Vec2(x, y)
  }

  get x() { return this.pos.x }
  get y() { return this.pos.y }
  get w() { return 0 }
  get h() { return 0 }

  set x(x) { this.pos.x = x }
  set y(y) { this.pos.y = y }

  get x1() { return this.x }
  get y1() { return this.y }
  get x2() { return this.x }
  get y2() { return this.y }

  intersects(other: ShapeTypes): boolean {
    if (other instanceof Rect) {
      return Rect.intersectsPoint(other, this)
    }

    if (other instanceof Circle) {
      return Circle.intersectsPoint(other, this)
    }

    if (other instanceof Line) {
      return Line.intersectsPoint(other, this)
    }

    if (other instanceof Point) {
      return Point.intersectsPoint(other, this)
    }

    assertUnreachable(other)
  }

  static intersectsPoint(self: Point, other: Point): boolean {
    assertUnimplemented('Point vs Point')
  }
}