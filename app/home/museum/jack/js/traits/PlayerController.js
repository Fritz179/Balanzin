import Trait from './Trait.js'
import KeyboardState from '../KeyboardState.js'

export default class PlayerController extends Trait {
  constructor(entity) {
    super("playerController")
    this.entity = entity

    this.keyboardState = new KeyboardState()

    this.keyboardState.addMapping('KeyD', (key) => {
      this.entity.dir += key ? 1 : -1
    })
    this.keyboardState.addMapping('KeyA', (key) => {
      this.entity.dir += key ? -1 : 1
    })
    this.keyboardState.addMapping('Space', (key) => {
      if (key) {
        entity.jump.request()
      } else {
        entity.jump.stop()
      }
    })
  }
}
