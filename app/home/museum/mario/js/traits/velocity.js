import {trait} from '../entity.js'

export default class velocity extends trait{
  constructor() {
    super('velocity')
  }

  update(entity, deltaTime) {
    entity.pos.x += entity.vel.x * deltaTime
    entity.pos.y += entity.vel.y * deltaTime
  }
}
