import JAPSUpdater from './JAPSUpdater.js'
import JAPSRenderer from './JAPSRenderer.js'
import JapsCollider from './JAPSCollider.js'
import { Shape, Rect, Circle, Line, Point } from '../math/Shape.js'
import Entity from '../Entity.js'
import Vec2 from '../math/Vec2.js'

const screen = document.getElementById('screen')! as HTMLCanvasElement

export default class JAPS extends Rect {
  updater = new JAPSUpdater(this)
  renderer = new JAPSRenderer(this, screen)
  collider = new JapsCollider(this)
  mouse = new Vec2(0, 0)

  constructor(w: number, h: number) {
    super(0, 0, w, h)

    this.renderer.setCanvasSize(w, h)
  }

  update() {
    this.updater.updateStart()

    this.collider.collide()

    this.updater.updateEnd()
  }

  render() {
    this.renderer.render()
  }

  mouseClick(x: number, y: number, _e: MouseEvent) {
    const num = Math.random()

    let shape: Shape = new Rect(x, y, 20, 20)
    if (num < 0.6) shape = new Circle(x, y, 20)
    if (num < 0.3) shape = new Line(x, y, 20, 20)

    const entity = new Entity(shape)
    // entity.register(this, true)
  }

  mouseMove(x: number, y: number, _e: MouseEvent) {
    this.mouse.set(x, y)
  }

  key(key: string) {
    const {x, y} = this.mouse

    let shape: Shape | null = null
    if (key == 'r') shape = new Rect(x, y, 20, 20)
    if (key == 'c') shape = new Circle(x, y, 20)
    if (key == 'l') shape = new Line(x, y, 20, 20)

    if (shape) {
      const entity = new Entity(shape)
      entity.register(this, true)
    }
  }
}