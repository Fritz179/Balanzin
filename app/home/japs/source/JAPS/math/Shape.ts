import Vec2 from './Vec2.js'

// static shapes
import Rect from './shapes/Rect.js'
import Circle from './shapes/Circle.js'
import Line from './shapes/Line.js'
import Point from './shapes/Point.js'

// dynamic shapes
import DynamicRect from './dynamicShapes/DynamicRect.js'
import DynamicCircle from './dynamicShapes/DynamicCircle.js'
// import Line from './dynamicShapes/Line.js'
// import Point from './dynamicShapes/Point.js'

type ShapeTypes = Rect | Circle | Line | Point
type DynamicShapeTypes = DynamicRect | DynamicCircle // | Line | Point

// Static shapes
abstract class Shape {
  abstract pos: Vec2

  abstract get x()
  abstract get y()
  abstract get w()
  abstract get h()

  abstract set x(x: number)
  abstract set y(y: number)
  abstract set w(x: number)
  abstract set h(y: number)

  abstract get x1()
  abstract get y1()
  abstract get x2()
  abstract get y2()

  abstract set x1(x: number)
  abstract set y1(y: number)
  abstract set x2(x: number)
  abstract set y2(y: number)

  abstract intersects(other: ShapeTypes): boolean
}

// Dynamic Shapes
abstract class DynamicShape {
  vel = new Vec2(0, 0)

  abstract get xv()
  abstract get yv()

  abstract set xv(x: number)
  abstract set yv(y: number)

  abstract solveCollision(other: Shape): boolean
}

// Export all shapes types
export {
  Shape,
  DynamicShape,
  ShapeTypes,
  Rect,
  Circle,
  Point,
  Line,
  DynamicShapeTypes,
  DynamicRect,
  DynamicCircle,
  // DynamicPoint,
  // DynamicLine
}