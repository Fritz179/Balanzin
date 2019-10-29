import Background from './Background.js'
import Sprites from './Sprites.js'
import GUI from './GUI.js'

export default class Renderer {
  constructor(level) {
    this.background = new Background(level)
    this.sprites = new Sprites(level)
    this.gui = new GUI(level)
  }

  draw() {
    this.background.draw()
    this.sprites.draw()
    this.gui.draw()
  }

  init() {
    this.background.redrawAll()
  }
}
