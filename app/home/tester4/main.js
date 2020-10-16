import Player from './Player.js'
import Blocky from './Blocky.js'
import App from '/libraries/fritz_4/App.js'
import Trigger from '/libraries/fritz_4/Trigger.js'

new class Tester4 extends App {
  init(parent) {
    this.player = this.addChild(Player, 500, 500)
    this.addChild(Blocky, 100, 100, 200, 100)
    this.addChild(Blocky, 600, 800, 100, 500)
    this.addChild(Blocky, 200, 600, 600, 150)
    this.addChild(Blocky, 1200, 200, 300, 300)
    this.addChild(Blocky, 1050, 700, 100, 200)
    this.addChild(Blocky, 600, 300, 500, 50)

    const div = document.getElementById('screenDiv')
    this.player.init(div)
  }

  render(ctx) {
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const children = []
    this.children.forEach(set => {
      set.forEach(child => {

        if (child.getTrait(Trigger)) {
          children.push(child)
        }

        child.events.fire('update', ctx)
        child.events.fire('render', ctx)
      })
    })

    for (let i = 0; i < children.length; i++) {
      const ic = children[i]

      for (let j = i + 1; j < children.length; j++) {
        const jc = children[j]

        if (!(ic.left > jc.right || ic.top > jc.bottom || ic.right < jc.left || ic.bottom < jc.top)) {
          ic.events.fire('trigger', jc)
          jc.events.fire('trigger', ic)
        }
      }
    }
  }
}
