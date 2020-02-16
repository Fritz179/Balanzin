loadSprite('player', './img/sprites')
loadSprite('bullet', './img/sprites')
loadSprite('tiles', {path: './img/sprites', parser: 'pacman', json: false})
loadSprite('end', {path: './img/sprites', recursive: 4, json: false})
loadSprite('shooter', {path: './img/sprites', recursive: 5, ultraMirror: true, json: false})

const level0 = loadJSON('./levels/level_0.json')

let main, mobile = false
function setup() {
  addLayer(main = new Main())
  addLayer(new Overlay())
}

function even(x, y) {
  return [ceil(x / 2) * 2, ceil(y / 2) * 2]
}

class Main extends TileGame {
  constructor() {
    super(...even(window.innerWidth, window.innerHeight))

    this.setCameraMode({align: 'center', overflow: 'display'})
    this.backgroundColor = 0
    this.setScale(this.zoom = 5)

    this.player = new Player(16, 16)
    this.addChild(this.player)
    // this.addChild(new End([4, 5]))
    this.addChild(new Shooter([5, 3, 3]))

    // this.setSize(window.innerWidth, window.innerHeight)
    this.loadMap(loadLevel(level0))

    this.tilesFlipped = []
    this.removing = null
  }

  onResize({w, h}) {
    this.setSize(...even(w, h))
  }

  update() {
    let {x, y} = this.player.center
    this.sprite.center = {x: -x, y: -y}
    this.sprite.x = floor(this.sprite.x)
    this.sprite.y = floor(this.sprite.y)
  }

  getOffsets(i, w = this.chunkWidth) {
    const l = i % w == 0
    const r = i % w == w - 1

    return [l ? 0 : -w - 1, -w, r ? 0 : -w + 1, l ? 0 : -1, r ? 0 : 1, l ? 0 : w - 1, w, r ? 0 : w + 1]
  }

  onLeftClick({x, y}) {
    if (mobile) return

    x = floor(x / 16)
    y = floor(y / 16)
    const i = y * this.chunkWidth + x

    this.removing = this.tileAt(x, y) != 0
    this.flipTileAt(x, y)
    this.tilesFlipped = [i]
  }

  onLeftMouseDrag({x, y}) {
    if (mobile) return
    
    if (this._hovered) {
      x = floor(x / 16)
      y = floor(y / 16)
      const i = y * this.chunkWidth + x

      if (!this.tilesFlipped.includes(i) && (this.tileAt(x, y) != 0) == this.removing) {
        this.flipTileAt(x, y)
        this.tilesFlipped.push(i)
      }
    }
  }

  flipTileAt(x, y) {
    this.setTileAt(x, y, this.tileAt(x, y) ? 0 : 1)

    // update tiles
    const w = this.chunkWidth
    const i = y * w + x;

    this.getOffsets(i).concat([0]).forEach(j => {
      this.updateTileAt(i + j)
    })
  }

  updateTileAt(i) {
    const offsets = this.getOffsets(i).map(offset => {
      return offset ? this.chunks[0][0].tiles[i + offset] == 0 : 0
    })

    const x = (i) % this.chunkWidth
    const y = (i - x) / this.chunkWidth
    if (this.tileAt(x, y)) {
      const wall = this.getOffsets(i).some(offset => {
        return this.chunks[0][0].tiles[i + offset] == 0
      })

      this.setTileAt(x, y, wall ? getPacmanTileId(offsets) : -1)
    }
  }

  onWheel({dir}) {
    this.zoom -= dir

    if (this.zoom <= 0) this.zoom = 1
    else if (this.zoom > 10) this.zoom = 10

    this.setScale(this.zoom)
  }

  touch(event) {
    mobile = true

    const client = event.changedTouches[0]
    let x = client.clientX
    let y = client.clientY
    const r = Math.sin(Math.PI / 4)

    x = x - masterLayer.w / 2
    y = y - masterLayer.h / 2

    const xd = x * r - y * r
    const yd = x * r + y * r

    let xs = 0, ys = 0, dir

    if (xd > 0) { // up right
      if (yd > 0) { // right
        xs = 1
        dir = 3
      } else { // up
        ys = -1
        dir = 2
      }
    } else {
      if (yd > 0) { // down left
        ys = 1 // down
        dir = 0
      } else {
        xs = -1 // left
        dir = 1
      }
    }
    main.player.spriteDir = dir
    main.player.move(xs, ys)
  }
}

addEventListenerAfterPreload('touchstart', event => main.touch(event));

addEntities(Player, End)
