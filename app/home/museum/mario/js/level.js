import compositor from './compositor.js'
import {Matrix} from './math.js'
import TileCollider from './TileCollider.js'

export default class Level {
  constructor() {
    this.debugModeEnabled = 0
    this.gravity = 1500
    this.totalTime = 0
    this.comp = new compositor()
    this.entities = new Set()
    this.tiles = new Matrix()

    this.tileCollider = new TileCollider(this.tiles)
  }

  update(deltaTime) {
    this.entities.forEach(entity => {
      entity.update(deltaTime)

      entity.pos.x += entity.vel.x * deltaTime
      this.tileCollider.checkX(entity)
      entity.pos.y += entity.vel.y * deltaTime
      this.tileCollider.checkY(entity)

      entity.vel.y += this.gravity * deltaTime
    })
    this.totalTime += deltaTime
  }
}
