import Vec2 from '../Vec2.js'
import { Rect, DynamicShape, DynamicShapeTypes } from '../Shape.js'

export default class DynamicRect extends Rect implements DynamicShape {
  vel = new Vec2(0, 0)

  get xv() { return this.vel.x }
  get yv() { return this.vel.y }

  set xv(x) { this.vel.x = x }
  set yv(y) { this.vel.y = y }

  solveCollision(_other: DynamicShapeTypes) {
    return true
  }
}