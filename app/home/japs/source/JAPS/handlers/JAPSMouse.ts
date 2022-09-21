import ChildrenSet from './ChildrenBox.js'
import Vec2 from '../math/Vec2.js'

abstract class BasicListener {
  abstract click?(x: number, y: number, e: MouseEvent): void
  abstract move?(x: number, y: number, e: MouseEvent): void
}

export default class JAPSMouse extends ChildrenSet<BasicListener> {
  position = new Vec2(0, 0)

  click(e: MouseEvent) {
    this.position.set(e.x, e.y)

    this.children.forEach(child => {
      if (child.click) child.click(e.x, e.y, e)
    })
  }

  move(e: MouseEvent) {
    this.position.set(e.x, e.y)

    this.children.forEach(child => {
      if (child.move) child.move(e.x, e.y, e)
    })
  }
}
