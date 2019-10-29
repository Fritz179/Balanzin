class Game {
  constructor() {
    this.dis = createGraphics(windowWidth, windowHeight)
    this.dis.pixelDensity(1)
    this.toUpdate = false
    this.grid = []
    for (var i = 0; i < 30; i++) {
      this.grid[i] = []
      for (var j = 0; j < 30; j++) {
        this.grid[i][j] = {}
        this.grid[i][j].col = round(random(3))
        this.grid[i][j].colored = false
        this.grid[i][j].wrong = false
        this.grid[i][j].wrongColor = 0
      }
    }
    this.col = [color(0, 255, 255), color(255, 0, 0), color(255, 0, 255), color(255, 255, 0)]
    this.wrongCol = [color(0, 51, 51), color(51, 0, 0), color(51, 0, 51), color(51, 51, 0)]
    this.selected = 0
    this.mouseIsDown = false
  }

  start(i) {
    this.w = 30
    this.h = 30
    this.xOff = 0
    this.yOff = 0
    this.zoom = 1
    this.updateSize()
  }

  end() {
    background(255)
  }

  updateSize() {

    this.dis.size(windowWidth, windowHeight)
    this.dis.pixelDensity(1)
    this.updateDis()
  }


  updateDis() {
    this.dis.push()
    //this.dis.background(0, 255, 0)

    let minXL = (windowWidth - 1) / this.w * this.zoom
    let minYL = (windowHeight - 1) / this.h * this.zoom

    let minL = minXL > minYL ? minXL : minYL

    let xSpace = (minL * this.w) - windowWidth
    let ySpace = (minL * this.h) - windowHeight

    this.xOff = this.xOff < xSpace ? this.xOff : xSpace
    this.xOff = this.xOff >= 0 ? this.xOff : 0
    this.yOff = this.yOff < ySpace ? this.yOff : ySpace
    this.yOff = this.yOff >= 0 ? this.yOff : 0

    this.dis.translate(-this.xOff, -this.yOff)
    let len = round(minL)
    this.len = len
    this.dis.translate()
    this.grid.forEach((col, x) => {
      col.forEach((point, y) => {
        this.dis.stroke(0)
        if (point.colored) {
          this.dis.fill(this.col[point.col])
          this.dis.noStroke()
          let xM = this.grid[x-1][y] ? (this.grid[x-1][y].colored ? 0 : 1) : 0
          let yM = this.grid[x][y-1] ? (this.grid[x][y-1].colored ? 0 : 1) : 0
          this.dis.rect(x * len + xM, y * len + yM, len, len )
        } else {
          if (point.wrong) {
            this.dis.fill(this.wrongCol[point.wrongColor])
          } else if (this.selected == point.col) {
            this.dis.fill(204)
          } else {
            this.dis.fill(255)
          }
          this.dis.rect(x * len, y * len, len, len)
          this.dis.textAlign(CENTER, CENTER)
          this.dis.textSize(len/ 2)
          this.dis.fill(0)
          this.dis.text(point.col, x * len+ len/ 2, y * len+ len/ 2, )
        }
      })
    })


    this.dis.pop()
  }

  mostra() {
    if (this.toUpdate) {
      this.updateDis()
      this.toUpdate = false
    }
    push()
    //translate(this.xOff, this.yOff)
    background(255, 0, 0)
    image(this.dis, 0, 0)
    pop()

    if (this.mouseIsDown) {
      this.updateMouse(mouseX, mouseY)
    }
  }

  updateMouse(x, y) {
    x += this.xOff
    y += this.yOff

    x = (x - x % this.len) / this.len
    y = (y - y % this.len) / this.len
    x = round(x)
    y = round(y)

    if (x >= 0 && x < this.grid.length && y >= 0 && y < this.grid[0].length) {
      this.toUpdate = true
      if (this.selected == this.grid[x][y].col) {
        this.grid[x][y].colored = true
      } else {
        this.grid[x][y].colored = false
        this.grid[x][y].wrong = true
        this.grid[x][y].wrongColor = this.grid[x][y].col
      }
    }
  }

  mousePressed(x, y) {
    this.updateMouse(x, y)
    this.mouseIsDown = true
  }

  mouseReleased(x, y) {
    this.mouseIsDown = false
  }

  keyPressed(key) {
    this.toUpdate = true

    if (key == 27) {
      changeStatus("escape", [])
    }
    if (key == 48 || key == 96) {
      this.selected = 0
    }
    if (key == 49 || key == 97) {
      this.selected = 1
    }
    if (key == 50 || key == 98) {
      this.selected = 2
    }
    if (key == 51 || key == 99) {
      this.selected = 3
    }
    if (key == 52 || key == 100) {
      this.selected = 4
    }
    if (key == 68) {
      if (keyIsDown(SHIFT)) {
        this.xOff += 99
      }
      this.xOff += 1
    }
    if (key == 65) {
      this.xOff += -1
    }
    if (key == 83) {
      this.yOff += 1
    }
    if (key == 87 ) {
      this.yOff += -1
    }
    if (key == 88) {
      this.zoom *= 1.2
    }
    if (key == 89) {
      this.zoom /= 1.2
      this.zoom = this.zoom >= 1 ? this.zoom : 1
    }
    if (key == 70) {
      //fullscreen(!fullscreen())
    }
  }
}
