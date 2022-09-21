import ChildrenSet from './ChildrenBox.js'
import { Shape } from '../math/Shape.js'

abstract class BasicCollider extends Shape {
  abstract solveCollision(other: Shape, solve: () => void): void
}

abstract class BasicSolver {
  abstract bb: Shape
  abstract onCollision(other: Shape, solve: () => void): void
}

export default class JAPSCollider extends ChildrenSet<BasicSolver> {
  collide() {
    const children = [...this.children]

    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      // child.yv += 1
      //
      // child.x += child.xv
      // child.y += child.yv
      //
      // if (child.y2 > this.master.h) {
      //   child.y2 = this.master.h
      //   child.yv = 0
      // }

      for (let j = i + 1; j < children.length; j++) {
        const other = children[j]

        if (child.bb.intersects(other.bb)) {
          child.onCollision(other.bb, () => {})
          other.onCollision(child.bb, () => {})
        }
      }
    }
  }
}