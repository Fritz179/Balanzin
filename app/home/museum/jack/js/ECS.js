import Player from './entities/Player.js'

export default class ECS {
  constructor(level) {
    this.level = level
    this.entities = []
  }

  update() {
    this.entities.forEach(entity => {
      entity.update()
    })

    this.entities.forEach(entity => {
      entity.updateDrawing()
    })
  }

  addEntity(entity, x, y) {
    console.warn("vecchia funzione");
    debugger
  }

  addPlayer(x, y) {
    this.entities.push(new Player(x, y, this.level))
  }

  draw() {
    this.entities.forEach(entity => {
      entity.draw()
    })
  }
}
