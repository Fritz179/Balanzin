export default class Camera {
  constructor(level, x, y) {
    this.x = x
    this.y = y
    this.w = window.innerWidth    //con zoom
    this.h = window.innerHeight
    this.width = this.w           //sempre così
    this.height = this.h
    this.mw = window.screen.width
    this.mh = window.screen.height
    this.zoom = 1
    this.level = level
    this.tileSize = 16
    this.chunkTile = 16
    this.chunkSize = this.tileSize * this.chunkTile
  }

  follow(entity) {
    this.x = entity.x - this.w / 2
    this.y = entity.y - this.h / 2
    this.x = this.x > 0 ? this.x : 0
    this.y = this.y > 0 ? this.y : 0
  }

  createCanvas(w = this.mw, h = this.mh) {
    let temp = {}
    temp.canvas = document.createElement('canvas')
    temp.canvas.width = w
    temp.canvas.height = h
    temp.context = temp.canvas.getContext('2d')
    return temp
  }
}
