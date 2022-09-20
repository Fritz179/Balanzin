import { Shape, Rect, Line } from './math/Shape.js'
import Vec2 from './math/Vec2.js'
import Renderer from './JAPS/JAPSRenderer.js'

import JABS from './JAPS/JAPS.js'
export default class Entity {
  intersecting = 0
  bb: Shape
  pos: Vec2

  constructor(shape: Shape) {
    this.bb = shape
    this.pos = this.bb.pos
  }

  register(parent: JABS, registering: boolean) {
    parent.updater.register(this, registering)
    parent.renderer.register(this, registering)
    parent.collider.register(this, registering)
  }

  updateStart() {
    this.intersecting = 0
  }

  onCollision(other: Shape, solve: () => void) {
    this.intersecting = 1

    if (other instanceof Rect) {
      this.intersecting |= 1
    }

    if (other instanceof Line) {
      this.intersecting |= 2
    }
  }

  updateEnd() {

  }

  render(renderer: Renderer) {
    let fillStyle = '#000'
    if (this.intersecting == 1)
      fillStyle = '#F00'
    if (this.intersecting == 2)
      fillStyle = '#0F0'
    if (this.intersecting == 3)
      fillStyle = '#FF0'

    renderer.shape(this.bb, fillStyle)
  }
}



