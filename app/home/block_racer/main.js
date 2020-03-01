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
    super('auto')

    this.backgroundColor = 0
    this.setCameraMode({align: 'center', overflow: 'display'})
    this.setScale(this.zoom = 5)

    this.player = new Player(16, 16)
    this.addChild(this.player)
    // this.addChild(new End([4, 5]))
    this.addChild(new Shooter([5, 3, 3]))

    this.loadMap(loadLevel(level0))

    this.tilesFlipped = []
    this.removing = null
    this.shift = false
    this.control = false

    this.setSize(window.innerWidth, window.innerHeight, true)
  }


  update() {
    let {x, y} = this.player.center
    this.sprite.center = {x: x, y: y}
    this.sprite.x = floor(this.sprite.x)
    this.sprite.y = floor(this.sprite.y)
  }

  getOffsets(i, w = this.chunkWidth) {
    const l = i % w == 0
    const r = i % w == w - 1

    return [l ? 0 : -w - 1, -w, r ? 0 : -w + 1, l ? 0 : -1, r ? 0 : 1, l ? 0 : w - 1, w, r ? 0 : w + 1]
  }

  onLeftClick({x, y}) {
    console.log(x, y);
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

  onKey({name, stopPropagation}) {
    if (this.shift) {
      switch (name) {
        case 'left': this.resize(1, 0, 0, 0); break;
        case 'up': this.resize(0, 1, 0, 0); break;
        case 'right': this.resize(0, 0, 1, 0); break;
        case 'down': this.resize(0, 0, 0, 1); break;
      }
      stopPropagation()
    } else if (this.control) {
      switch (name) {
        case 'left': this.resize(-1, 0, 0, 0); break;
        case 'up': this.resize(0, -1, 0, 0); break;
        case 'right': this.resize(0, 0, -1, 0); break;
        case 'down': this.resize(0, 0, 0, -1); break;
      }
      stopPropagation()
    } else {
      switch (name) {
        case 'Shift': this.shift = true; break;
        case 'Control': this.control = true; break;
      }
    }
  }

  onKeyUp({name}) {
    switch (name) {
      case 'Shift': this.shift = false; break;
      case 'Control': this.control = false; break;
    }
  }

  resize(x1, y1, x2, y2) {
    const w = this.chunkWidth
    const h = this.chunkHeight
    const map = this.chunks[0][0].tiles
    const newMap = []

    const newW = w + x1 + x2
    const newH = h + y1 + y2
    for (let x = 0; x < newW; x++) {
      for (let y = 0; y < newH; y++) {
        const i = y * newW + x

        if (x >= x1 && x - x1 < w && y >= y1 && y - y1 < h) {
          newMap[i] = map[(y - y1) * w + x - x1]
        } else {
          newMap[i] = -1
        }
      }
    }

    this.loadMap({
      entities: [],
      data: newMap,
      width: newW
    })

    for (let i = 0; i < this.chunkLength; i++) {
      this.updateTileAt(i)
    }

    this.forEachChild(child => {
      child.pos.add(x1 * 16, y1 * 16)
    })
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
