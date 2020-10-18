import Player from './Player.js'
import Blocky from './Blocky.js'
import App from '/libraries/fritz_4/App.js'
import Trigger from '/libraries/fritz_4/Trigger.js'
import ChildCollider from '/libraries/fritz_4/ChildCollider.js'

const hexVals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
function randomHex() {
  return hexVals[Math.floor(Math.random() * 16)]
}

function randomColor() {
  const r = randomHex
  return `#${r()}${r()}${r()}`
}

const canvas = document.getElementById('screenCanvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

new class Tester4 extends App {
  register(listen) {
    this.addTrait(ChildCollider)
    
    this.player = this.addChild(Player, 500, 500)
    this.addChild(Blocky, 100, 100, 200, 100, randomColor())
    this.addChild(Blocky, 600, 800, 100, 500, randomColor())
    this.addChild(Blocky, 200, 600, 600, 150, randomColor())
    this.addChild(Blocky, 1200, 200, 300, 300, randomColor())
    this.addChild(Blocky, 1050, 700, 100, 200, randomColor())
    this.addChild(Blocky, 600, 300, 500, 50, randomColor())


    listen('render', () => this.render())
    listen('update', () => {
      this.children.forEach(set => {
        set.forEach(child => {
          child.events.fire('update')
        })
      })
    })
  }

  render() {
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    this.children.forEach(set => {
      set.forEach(child => {
        child.events.fire('render', ctx)
      })
    })
  }
}
