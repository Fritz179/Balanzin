import {Trait} from './Entity.js'

export default class Sprite extends Trait {
  constructor(player) {
    super()

    this.canvas = document.createElement('canvas')
    this.canvas.width = 50
    this.canvas.height = 50
    this.ctx = this.canvas.getContext('2d')
  }
}
