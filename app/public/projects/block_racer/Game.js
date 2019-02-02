const tileWidth = 64

class Game {
  constructor() {
    this.tiles = ['air', 'wall']
    this.tiles.forEach((tile, i) => {
      this.tiles[tile] = i
    })

    this.camera = new Camera(this)
  }

  loadLevel(level) {
    this.map = []
    let w = this.mapW = level.size[0] + 1
    let h = this.mapH = level.size[1] + 1

    for (let x = 0; x < w; x++) {
      this.map[x] = []
      for (let y = 0; y < h; y++) {
        this.map[x][y] = 1
      }
    }

    level.spaces.forEach(space => {
      this.map[space[0]][space[1]] = 0
    })

    level.rect.forEach(rect => {
      let [x1, y1, x2, y2] = rect
      let x = x1, y = y1
      do {
        y = y1
        do {
          this.map[x][y] = 0
          y++
        } while (y <= y2);
        x++
      } while (x <= x2);
    })

    this.map[level.end[0]][level.end[1]] = 0
    this.end = level.end

    this.player = new Player(level.start[0], level.start[1])
    this.entities = [this.player]

    console.log(this);
  }

  draw() {
    this.entities.forEach(entity => {
      entity.update()
    })

    this.camera.draw()
  }

  getTile(x, y) {
    if (x < 0 || y < 0 || x >= this.mapW || y >= this.mapH) {
      return this.tiles[0]
    } else {
      return this.tiles[this.map[x][y]]
    }
  }

  drawTile(tile, x, y) {
    tile == 'air' ? fill(255) : fill(0)
    noStroke()
    rect(x, y, tileWidth, tileWidth)
  }

  keyPressed() {
    this.player.keyPressed()
  }
}

class Player {
  constructor(x, y) {
    this.speed = 0.3
    this.x = x
    this.y = y
    this.w = tileWidth
    this.h = tileWidth
    this.moving = false
    this.end = app.game.end
  }

  draw(xOff, yOff) {
    fill(34, 153, 84)
    rect(floor(this.x * tileWidth + xOff), floor(this.y * tileWidth + yOff), tileWidth, tileWidth)
  }

  keyPressed() {
    const dirs = {
      ArrowUp: [0, -1],
      ArrowRight: [1, 0],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0]
    }

    if (dirs[key] && !this.moving) {
      const dir = dirs[key]

      if (app.game.getTile(this.x + dir[0], this.y + dir[1]) == 'air') {
        this.move(dir[0], dir[1])
      }
    }
  }

  move(x, y) {
    this.moving = true
    this.dest = this.searcDir(this.x, this.y, x, y)
  }

  update() {
    if (this.moving) {
      let xoff = this.dest[0] - this.x
      let axoff = abs(xoff)

      if (axoff > this.speed) {
        this.x += axoff == xoff ? this.speed : -this.speed
      }

      let yoff = this.dest[1] - this.y
      let ayoff = abs(yoff)

      if (ayoff > this.speed) {
        this.y += ayoff == yoff ? this.speed : -this.speed
      }

      if (axoff <= this.speed && ayoff <= this.speed) {
        this.x = round(this.x)
        this.y = round(this.y)
        console.log(this.x, this.y);
        this.moving = false
      }
    } else if (this.x == this.end[0] && this.y == this.end[1]) {
      if (app.currentLevel == app.unlockedLevel) {
        app.unlockedLevel += 1
      }
      status = 'levelMenu'
    }
  }

  searcDir(x, y, xv, yv) {
    map = app.game.map

    while(map[x][y] == 0) {
      x += xv
      y += yv
    }

    return [x - xv, y - yv]
  }
}

class Camera {
  constructor(game) {
    this.game = game
  }

  draw() {
    if (this.game.player) {
      const player = this.game.player
      let xoff = (player.x * tileWidth + player.w / 2 - width / 2) / tileWidth
      let yoff = (player.y * tileWidth + player.h / 2 - height / 2) / tileWidth
      const startX = floor(xoff)
      const startY = floor(yoff)
      console.log(xoff, startX);
      xoff *= tileWidth
      yoff *= tileWidth
      let xdiff = startX * tileWidth - xoff
      let ydiff = startY * tileWidth - yoff
      let w = ceil(width / tileWidth) + 1
      let h = ceil(height / tileWidth) + 1
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          const tile = this.game.getTile(x + startX, y + startY)
          this.game.drawTile(tile, floor(x * tileWidth + xdiff), floor(y * tileWidth + ydiff))
        }
      }

      this.game.entities.forEach(entity => {
        entity.draw(-xoff, -yoff)
      })

      fill(0, 0, 255)
      rect(floor((this.game.end[0] - startX) * tileWidth + xdiff), floor((this.game.end[1] - startY) * tileWidth + ydiff), tileWidth, tileWidth)
    }
  }
}
