import ChildrenSet from './ChildrenBox.js'

abstract class BasicListener {
  abstract onkey(key: string): void
}

export default class JAPSUpdater extends ChildrenSet<BasicListener> {
  down(key: string) {
    this.children.forEach(child => {
      child.onkey(key)
    })
  }
}