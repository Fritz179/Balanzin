import {vec2} from './math.js'

export default class Camera {
  constructor() {
    this.pos = new vec2(0, 0)
    this.size = new vec2(256, 224)
  }
}
