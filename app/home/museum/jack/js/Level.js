import bID from './bID.js'
import SpriteSheet from './SpriteSheet.js'
import Camera from './Camera.js'
import Renderer from './Rendering/Renderer.js'
import Timer from './Timer.js'
import ECS from './ECS.js'
import TileCollider from './TileCollider.js'
import TileResolver from './TileResolver.js'

export default class Level {
  constructor(context, definer, imgs) {
    this.context = context

    this.gravity = 0.4

    this.bID = new bID()
    this.bID.define(definer.sprites[0].tiles)

    this.spriteSheet = new SpriteSheet(this.bID)
    this.spriteSheet.defineAll(definer, imgs)

    this.camera = new Camera(this, 0, 0)

    this.map = createMap(1000, 1000)

    this.tileResolver = new TileResolver(this)
    this.tileCollider = new TileCollider(this)

    this.renderer = new Renderer(this)
    this.renderer.init()

    this.timer = new Timer(this, 1 / 60)

    this.ecs = new ECS(this)

    this.ecs.addPlayer(200, 400)

    console.log(this.bID.names, this.bID.id );

    this.update = () => {
      this.ecs.update()
      this.renderer.draw()
      this.camera.follow(this.ecs.entities[0])
    }

    console.log(this);
  }

  start() {
    this.timer.start()
  }

  stop() {
    this.timer.stop()
  }
}

function createMap(w, h) {
  let temp = []
  for (let x = 0; x < w; x++) {
    temp[x] = []
    for (let y = 0; y < w; y++) {
      if (x == 0 || x == w || y == 0 || y == w) {
        temp[x][y] = 1
      } else if (y < 30) {
        temp[x][y] = 0
      } else if (y == 30) {
        temp[x][y] = 1
      } else {
        temp[x][y] = y > 40  ? Math.random() > 0.5 ? 3 : 1 : Math.random() > 0.9 ? 1 : 0
      }
    }
  }
  return temp
}
