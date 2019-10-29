export default class Sprites {
  constructor(level) {
    this.level = level
  }

  draw() {
    this.level.ecs.entities.forEach(entity => {
      this.level.spriteSheet.drawAnim(this.level.context, entity.x - this.level.camera.x, entity.y - this.level.camera.y,
                                      entity.w, entity.h, entity.name, entity.status, entity.frame)
    })
  }
}
