// npx tsc ./source/main.ts --outDir ./out --module es2022 --target es2022 --strict --strictNullChecks --forceConsistentCasingInFileNames --skipLibCheck -w

import JAPS from './JAPS/JAPS.js'

import { Shape, Rect, Circle, Line, Point } from './JAPS/math/Shape.js'
import Entity from './Entity.js'

export default class Test extends JAPS {
  constructor() {
    super(200, 200)

    this.keyboard.register(this, true)
  }

  onkey(key: string) {
    console.log(key)

    const {x, y} = this.mouse.position

    let shape: Shape | null = null
    if (key == 'r') shape = new Rect(x, y, 20, 20)
    if (key == 'c') shape = new Circle(x, y, 20)
    if (key == 'l') shape = new Line(x, y, 20, 20)

    if (shape) {
      const entity = new Entity(shape)
      entity.register(this, true)
    }
  }

  click(x: number, y: number, _e: MouseEvent) {
    const num = Math.random()

    let shape: Shape = new Rect(x, y, 20, 20)
    if (num < 0.6) shape = new Circle(x, y, 20)
    if (num < 0.3) shape = new Line(x, y, 20, 20)

    const entity = new Entity(shape)
    // entity.register(this, true)
  }
}

const test = new Test()