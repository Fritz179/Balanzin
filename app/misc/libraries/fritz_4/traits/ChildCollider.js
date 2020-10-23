import Trigger from './Trigger.js'

export default class ChildCollider {
  constructor(master) {
    this.triggers = new Map()
    master.events.listen('addTrigger', this.registerTrigger.bind(this))
  }

  register(listen, master) {
    listen('update', () => this.update())
  }

  registerTrigger(box, callback) {
    this.triggers.set(box, callback)
  }

  unregisterTrigger(box) {
    this.triggers.delete(box)
  }

  update() {
    const children = [...this.triggers] // use triggersArray?

    for (let i = 0; i < children.length; i++) {
      const [ci, fi] = children[i]

      for (let j = i + 1; j < children.length; j++) {
        const [cj, fj] = children[j]

        if (!(ci.left > cj.right || ci.top > cj.bottom || ci.right < cj.left || ci.bottom < cj.top)) {
          fi(cj)
          fj(ci)
        }
      }
    }
  }
}
