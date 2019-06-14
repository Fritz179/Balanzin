class Game extends Status {
  constructor() {
    super()

    this.cameraSettings({w: 480, r: 16 / 9, mode: 'multiple', overflow: 'hidden'})
  }

  get mapX() { return this.cameraX + this.camera.x }
  get mapY() { return this.cameraY + this.camera.y }

  createSpawners(...spawners) { this.ecs.createSpawners(...spawners) }
}
