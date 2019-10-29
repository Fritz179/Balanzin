class Drawing {
  constructor() {
    this.w = 0
    this.h = 0
    this.xT = 0
    this.yT = 0
    this.xOff = 0
    this.yOff = 0
    this.links = []
    this.r = 5
    this.iR = 10
    this.mouseXS = -1
    this.mouseYS = -1
    this.mouseIsPressed = false
    this.showGrid = true
    this.mirrorX = false
    this.mirrorY = false
    this.ddd = 1
    this.toUpdate = false
  }

  start(i) {
    this.w = i.w
    this.h = i.h
    this.r = i.r
    this.iR = i.iR
    this.ddd = i.ddd
    this.updateSize()
    if (i.lineW != 0 ) {
      this.lineW = i.lineW
    }
    this.toUpdate = true
  }

  end() {
    background(255)
  }

  updateSize() {
    this.xL = windowWidth / ((this.w + 1) * this.ddd)
    this.yL = windowHeight / (this.h + 1)
    if (this.xL / this.ddd < this.yL) {
      this.yL = round(this.xL / this.ddd)
    } else {
      this.xL = round(this.yL * this.ddd)
    }
    this.xT = this.w * this.xL - this.xL
    this.yT = this.h * this.yL - this.yL
    this.xOff = round((windowWidth - this.xT) / 2)
    this.yOff = round((windowHeight - this.yT) / 2)
    this.lineW = 5
    if (this.dis) {
      this.dis.size(round(this.xT + this.xL), round(this.yT + this.yL))
      this.dis.pixelDensity(1)
      this.updateDis()
    } else {
      this.dis = createGraphics(round(this.xT + this.xL), round(this.yT + this.yL))
      this.dis.pixelDensity(1)
      this.updateDis()
    }
  }

  sposta(x = 0, y = 0) {
    this.links.forEach(link => {
      link.forEach(point => {
        point.x += x
        point.y += y
      })
    })
    let toSplice = false
    for (let i = this.links.length - 1; i >= 0; i--) {
      toSplice = false
      this.links[i].forEach(point => {
        if (point.x < 0 || point.x >= this.w || point.y < 0 || point.y >= this.h) {
          toSplice = true
        }
      })
      if (toSplice) {
        this.links.splice(i, 1)
      }
    }
  }

  updateDis() {
    this.dis.push()
    this.dis.translate(this.xL / 2, this.yL / 2)
    this.dis.background(255)
    this.dis.fill(0)
    if (this.showGrid) {
      this.dis.strokeWeight(this.lineW * 0.75)
      this.dis.stroke(255, 0, 0)
      let x = this.w / 2 - 0.5
      let y = this.h / 2 - 0.5
      if (this.mirrorX) {
        this.dis.stroke(46, 134, 193)
      } else {
        this.dis.stroke(255, 0, 0)
      }
      this.dis.line(x * this.xL, 0, x * this.xL, this.yT)
      if (this.mirrorY) {
        this.dis.stroke(46, 134, 193)
      } else {
        this.dis.stroke(255, 0, 0)
      }
      this.dis.line(0, y * this.yL, this.xT, y * this.yL)
      this.dis.noStroke()
      for (let x = 0; x < this.w; x++) {
        for (let y = 0; y < this.h; y++) {
          this.dis.ellipse(x * this.xL, y * this.yL, this.r * 2, this.r * 2)
        }
      }
    }
    if (this.links) {
      this.dis.strokeWeight(this.lineW)
      this.dis.stroke(0)
      this.links.forEach(link => {
        this.dis.line(link[0].x * this.xL, link[0].y * this.yL, link[1].x * this.xL, link[1].y * this.yL)
      })
    }
    this.dis.pop()
  }

  mostra() {
    if (this.toUpdate) {
      this.updateDis()
      this.toUpdate = false
    }
    push()
    translate(this.xOff, this.yOff)
    background(255)
    image(this.dis, - this.xL / 2, - this.yL / 2)


    let xS = round((mouseX - this.xOff) / this.xL)
    let yS = round((mouseY - this.yOff) / this.yL)
    if (xS >= 0 && xS < this.w && yS >= 0 && yS < this.h) {
      let xP = xS * this.xL
      let yP = yS * this.yL
      if (dist(xP, yP, mouseX - this.xOff, mouseY - this.yOff) < this.iR) {
        fill(100)
        noStroke()
        ellipse(xS * this.xL, yS * this.yL, this.iR * 2, this.iR * 2)
        sS.input("overPoint", [xS, yS])
      }
    }
    if (this.mouseIsPressed) {
      strokeWeight(this.lineW)
      stroke(51)
      line(this.mouseXS * this.xL, this.mouseYS * this.yL, mouseX - this.xOff, mouseY - this.yOff)
    }
    pop()
  }

  mousePressed(x, y) {
    x -= this.xOff
    y -= this.yOff
    let xS = round(x / this.xL)
    let yS = round(y / this.yL)
    if (xS >= 0 && xS < this.w && yS >= 0 && yS < this.h) {
      let xP = xS * this.xL
      let yP = yS * this.yL
      if (dist(xP, yP, x, y) < this.iR) {
        this.mouseXS = xS
        this.mouseYS = yS
        this.mouseIsPressed = true
      } else {
        console.log("fuori point")
      }
    } else {
      console.log("fuori grid")
    }
  }

  mouseReleased(x, y) {
    x -= this.xOff
    y -= this.yOff
    this.mouseIsPressed = false
    if (this.mouseXS != -1) {
      let xS = round(x / this.xL)
      let yS = round(y / this.yL)
      if (xS >= 0 && xS < this.w && yS >= 0 && yS < this.h) {
        let xP = xS * this.xL
        let yP = yS * this.yL
        if (dist(xP, yP, x, y) < this.iR && (this.mouseXS != xS || this.mouseYS != yS)) {
          this.toUpdate = true
          this.insertLink(xS, yS, this.mouseXS, this.mouseYS)
          sS.input("newLine")
          if (this.mirrorX || this.mirrorY) {
            let xM = this.w - 1
            let yM = this.h - 1
            if (this.mirrorX) {
              this.insertLink(xM - xS, yS, xM - this.mouseXS, this.mouseYS)
            }
            if (this.mirrorY) {
              this.insertLink(xS, yM - yS, this.mouseXS, yM - this.mouseYS)
            }
            if (this.mirrorX && this.mirrorY) {
              this.insertLink(xM - xS, yM - yS, xM - this.mouseXS, yM - this.mouseYS)
            }
          }
          this.mouseXS = -1
          this.mouseYS = -1
        } else {
          console.log("fuori point", xS)
        }
      } else {
        console.log("fuori grid", yS)
      }
    }

  }

  insertLink(xS1, yS1, xS2, yS2) {
    let link = [
      {
        x: xS1,
        y: yS1
      },
      {
        x: xS2,
        y: yS2
      }
    ]
    let toInsert = true
    this.links.forEach((link, i) => {
      if ((link[0].x == xS1 && link[0].y == yS1 && link[1].x == xS2 && link[1].y == yS2) ||
      (link[1].x == xS1 && link[1].y == yS1 && link[0].x == xS2 && link[0].y == yS2)) {
        toInsert = false
        this.links.splice (i, 1)
      }
    })
    if (toInsert) {
      this.links.push(link)
    }
  }

  rotate(destra) {
    [this.w, this.h] = [this.h, this.w];
    this.updateSize()
    this.links.forEach(link => {
      link.forEach(point => {
        point.x++
        point.y++

        if (destra) {
          [point.x, point.y] = [point.y, point.x];
          point.y = this.h - point.y
          point.x--
        } else {
          [point.x, point.y] = [point.y, point.x];
          point.x = this.w - point.x
          point.y--
        }

      })
    })
  }

  disegnaLinks(type, x, y, q) {
    if (type == "a") {
      if (q == 1) {
        this.insertLink(x - 1, y, x + 1, y)
        this.insertLink(x, y - 1, x, y + 1)
        this.insertLink(x - 1, y - 1, x - 1, y)
        this.insertLink(x - 1, y + 1, x, y + 1)
        this.insertLink(x + 1, y + 1, x + 1, y)
        this.insertLink(x + 1, y - 1, x, y - 1)
        sS.input("newLine")
      } else {
        let m = 0
        if (q == 2) {
          m = 3
        } else if (q == 3) {
          m = 18
        } else if (q == 4) {
          m = 108
        }
        let xx = m
        let yy = m
        let c = "a"
        q = q - 1
        this.disegnaLinks(c, x, y, q)
        this.disegnaLinks(c, x - xx, y, q)
        this.disegnaLinks(c, x + xx, y, q)
        this.disegnaLinks(c, x, y - yy, q)
        this.disegnaLinks(c, x, y + yy, q)
        this.disegnaLinks(c, x - xx - xx, y, q)
        this.disegnaLinks(c, x + xx + xx, y, q)
        this.disegnaLinks(c, x, y - yy - yy, q)
        this.disegnaLinks(c, x, y + yy + yy, q)

        this.disegnaLinks(c, x - xx - xx, y - yy, q)
        this.disegnaLinks(c, x - xx - xx, y + yy + yy, q)
        this.disegnaLinks(c, x - xx, y + yy + yy, q)
        this.disegnaLinks(c, x + xx + xx, y + yy + yy, q)
        this.disegnaLinks(c, x + xx + xx, y + yy, q)
        this.disegnaLinks(c, x + xx + xx, y - yy - yy, q)
        this.disegnaLinks(c, x + xx, y - yy - yy, q)
        this.disegnaLinks(c, x - xx - xx, y - yy - yy, q)
      }
    }
  }

  disegna(type, x, y, q) {
    x -= this.xOff
    y -= this.yOff
    let xS = round(x / this.xL)
    let yS = round(y / this.yL)
    if (xS >= 0 && xS < this.w && yS >= 0 && yS < this.h) {
      let xP = xS * this.xL
      let yP = yS * this.yL
      if (dist(xP, yP, x, y) < this.iR) {
        console.log(xS, this.w, yS, this.h)
        this.disegnaLinks(type, xS, yS, q)
        this.toUpdate = true
      }
    }
  }

  keyPressed(key) {
    this.toUpdate = true
    if (key == 65) {
      if (keyIsDown(SHIFT)) {
        if (keyIsDown(CONTROL)) {
          if (keyIsDown(ALT)) {
            this.disegna("a", mouseX, mouseY, 4)
          } else {
            this.disegna("a", mouseX, mouseY, 3)
          }
        } else {
          this.disegna("a", mouseX, mouseY, 2)
        }
      } else {
        this.disegna("a", mouseX, mouseY, 1)
      }
    }
    if (key == 27) {
      changeStatus("escape", [this.w, this.h, this.r, this.iR, this.ddd, this.lineW])
    }
    if (key == 68) {
      this.ddd = this.ddd == 1 ? 1.7 : 1
      this.updateSize()
    }
    if (key == 81) {
      this.rotate(true)
    }
    if (key == 69) {
      this.rotate(false)
    }
    if (key == 71) {
      this.showGrid = !this.showGrid
      console.log("grid", this.showGrid)
    }
    if (key == 88) {
      this.mirrorX = !this.mirrorX
      console.log("X", this.mirrorX)
    }
    if (key == 89) {
      this.mirrorY = !this.mirrorY
      console.log("Y", this.mirrorY )
    }
    if (key == 70) {
       //fullscreen(!fullscreen())
    }
    if (keyIsDown(CONTROL)) {
      if (key == 37) {
        this.aggiungi(1, 0, true)
      }
      if (key == 38) {
        this.aggiungi(0, 1, true)
      }
      if (key == 39) {
        this.aggiungi(1, 0, false)
      }
      if (key == 40) {
        this.aggiungi(0, 1, false)
      }
    } else {
      if (key == 37) {
        this.sposta(-1, 0)
      }
      if (key == 38) {
        this.sposta(0, -1)
      }
      if (key == 39) {
        this.sposta(1, 0)
      }
      if (key == 40) {
        this.sposta(0, 1)
      }
    }
  }

  aggiungi(x, y, sposta) {
    if (keyIsDown(SHIFT)) {
      this.w -= x
      this.h -= y
      this.updateSize()
      if (sposta) {
        this.sposta(-x, -y)
      }
      } else {
        this.w += x
        this.h += y
        this.updateSize()
        if (sposta) {
          this.sposta(x, y)
        }
    }
  }
}
