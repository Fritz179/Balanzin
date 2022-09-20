import Vec2 from './Vec2.js';
// static shapes
import Rect from './shapes/Rect.js';
import Circle from './shapes/Circle.js';
import Line from './shapes/Line.js';
import Point from './shapes/Point.js';
// dynamic shapes
import DynamicRect from './dynamicShapes/DynamicRect.js';
import DynamicCircle from './dynamicShapes/DynamicCircle.js';
// Static shapes
class Shape {
}
// Dynamic Shapes
class DynamicShape {
    vel = new Vec2(0, 0);
}
// intersectionInfo
class IntersectionInfo {
}
// Export all shapes types
export { Shape, DynamicShape, Rect, Circle, Point, Line, DynamicRect, DynamicCircle,
// Point,
// Line
 };
