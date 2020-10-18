export default class Sprite {
  constructor(player) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = 50
    this.canvas.height = 50
    this.ctx = this.canvas.getContext('2d')
  }
}
