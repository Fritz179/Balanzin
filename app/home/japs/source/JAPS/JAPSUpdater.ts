import ChildrenSet from './ChildrenBox.js'

abstract class BasicUpdater {
  abstract updateStart(): void
  abstract updateEnd(): void
}

export default class JAPSUpdater extends ChildrenSet<BasicUpdater> {
  updateStart() {
    this.children.forEach(child => {
      child.updateStart()
    })
  }

  updateEnd() {
    this.children.forEach(child => {
      child.updateEnd()
    })
  }
}