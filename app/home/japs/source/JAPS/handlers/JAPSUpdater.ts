import ChildrenSet from './ChildrenBox.js'

abstract class BasicUpdater {
  abstract updateStart?(): void
  abstract update?(): void
  abstract updateEnd?(): void
}

export default class JAPSUpdater extends ChildrenSet<BasicUpdater> {
  updateStart() {
    this.children.forEach(child => {
      if (child.updateStart) child.updateStart()
    })
  }

  update() {
    this.children.forEach(child => {
      if (child.update) child.update()
    })
  }

  updateEnd() {
    this.children.forEach(child => {
      if (child.updateEnd) child.updateEnd()
    })
  }
}