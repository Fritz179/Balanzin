var immortale = false

class game {
  constructor(q, aa, v, delay, challengeType) {
    //q == quanti cubi, aa == velocità giro, v = velocità lineare, delay = prima di girare, challengeType
    gamestatus = "gioca"
    reset()
    if (!challengeType) {
      this.cT = "none"
    } else if (challengeType == "rE" || challengeType == "rH"){
      this.ca = 0
      this.cT = challengeType
    } else if (challengeType == "pot") {
      //sounds.nome2.loop()
      this.cT = challengeType
    }  else {
      this.cT = challengeType
    }
    this.q = q
    this.aa = aa
    this.p = 0
    this.v = v
    this.delay = delay
    this.w = {}
    this.w.tutto = windowWidth * 2
    this.w.w = windowHeight / 30
    this.w.dist = this.w.tutto / (q * 2)
    this.w.p = windowHeight / 2.3
    this.w.h = windowHeight / 3
    this.a = 0
    this.sopra = false
    this.in = false
    this.cubi = []
    for (let i = 0; i < q * 2; i++  ) {
      this.cubi[i] = new cubo(i * this.w.dist + this.w.dist, this.w.w, "red")
    }
    for (let i = 0; i < q * 6; i++  ) {
      this.cubi[this.cubi.length] = new cubo(i * this.w.dist / 3 - this.w.tutto / 2, -this.w.w, "black", -this.w.h, this.v)
      this.cubi[this.cubi.length] = new cubo(i * this.w.dist / 3 - this.w.tutto / 2, this.w.w, "black", this.w.h, this.v)
    }
  }

  gioca() {
    translate(windowWidth / 2, windowHeight / 2)
    rectMode("radius")
    colorMode(HSB)
    if (this.cT != "sF" || this.p < this.delay) {
      background(map(noise(this.a + 200), 0, 1, 0, 360 * 5) % 360, 50, 50)
    } else {
      background(random(360), 50, 50)
    }
    colorMode(RGB)
    if (this.p > this.delay) {
      if (this.cT == "none" || this.cT == "sF" || this.p < this.delay) {
        rotate(map(noise(this.a) - noise(0), 0, 1, -TWO_PI, TWO_PI * 3))
      } else if (this.cT == "rE"){
        rotate(this.ca)
        this.ca += random(-0.1, 0.1)
      } else if (this.cT == "rH") {
        rotate(this.ca)
        this.ca += random(-0.3, 0.3)
      } else {
        console.log("niente cT")
      }
      push()
      rotate(map(noise(this.a + 100) - noise(100), 0, 1, 0, TWO_PI * 5) % TWO_PI)
      for (let i = -15; i < 15; i++) {
        let d = i * this.w.w * 2
        stroke(0)
        line(d, -this.w.tutto / 2 + this.w.w, d, this.w.tutto / 2 + this.w.w)
        line(-this.w.tutto / 2, d + this.w.w, this.w.tutto / 2, d + this.w.w)
      }
      pop()
      this.a += this.aa
    } else {
      for (let i = -16; i < 16; i++) {
        let d = i * this.w.w * 2
        stroke(0)
        line(d, -this.w.tutto / 2 + this.w.w, d, this.w.tutto / 2 + this.w.w)
        line(-this.w.tutto / 2, d + this.w.w, this.w.tutto / 2, d + this.w.w)
      }
    }

    /*
    if (this.p > this.delay) {
      fill(map(noise(this.a + 200), 0, 1, 0, 255))
    } else {
      fill(0)
    }
    */

    if (this.cT != "sF" || this.p < this.delay) {
      fill(0)
    } else if (true) {
      colorMode(HSB)
      fill(random(360), 50, 50)
      colorMode(RGB)
    }
    rect(0, 0, this.w.tutto, this.w.w)
    rect(0, -this.w.h - windowHeight - this.w.w, windowHeight, windowHeight)
    rect(0, this.w.h + windowHeight + this.w.w, windowHeight, windowHeight)

    for (let i = 0; i < this.cubi.length; i++) {
      this.cubi[i].muovi()
      this.cubi[i].mostra()
      if (this.cubi[i].out()) {
        this.cubi[i].resetta()
      }
      if (this.cubi[i].in()) {
        this.in = true
      }
    }
    fill(50, 200, 50)
    if (this.sopra) {
      rect(-this.w.p, this.w.w * 2, this.w.w, this.w.w)
      if (this.cT != "sF" || this.p < this.delay) {
        fill(0)
      } else {
        colorMode(HSB)
        fill(random(360), 50, 50)
        colorMode(RGB)
      }
      rect(-this.w.p + this.w.w / 5 * 2.5, this.w.w * 2.4, this.w.w / 5, this.w.w / 5)
      rect(-this.w.p - this.w.w / 5 * 2.5, this.w.w * 2.4, this.w.w / 5, this.w.w / 5)
      rect(-this.w.p + this.w.w / 5 * 1, this.w.w * 1.8, this.w.w / 8, this.w.w / 8)
    } else {
      rect(-this.w.p, -this.w.w * 2, this.w.w, this.w.w)
      if (this.cT != "sF" || this.p < this.delay) {
        fill(0)
      } else {
        colorMode(HSB)
        fill(random(360), 50, 50)
        colorMode(RGB)
      }
      rect(-this.w.p + this.w.w / 5 * 2.5, -this.w.w * 2.4, this.w.w / 5, this.w.w / 5)
      rect(-this.w.p - this.w.w / 5 * 2.5, -this.w.w * 2.4, this.w.w / 5, this.w.w / 5)
      rect(-this.w.p + this.w.w / 5 * 1, -this.w.w * 1.8, this.w.w / 8, this.w.w / 8)
    }
    textSize(64)
    fill(255)
    textAlign(CENTER)
    textFont('Courier New')
    text(this.p, 0, 20)
    this.p += round(this.v / 20)

    if (this.in && !immortale) {
      this.in = false
      gamestatus = "gameover"
      }
    }
  pressed() {
    this.sopra = !this.sopra
    if (this.cT == "pot" && this.p > 1) {
      //sounds.put.play()
      cSound.play()
    }
  }
}



class cubo {
  constructor(x, w, c, y, v) {
    this.c = c
    this.w = w
    this.x = x
    if (this.c == "red") {
      if (random() > 0.5) {
        this.y = this.w * 2
        this.sopra = true
      } else {
        this.y = -this.w * 2
        this.sopra = false
      }
    } else {
      this.y = y
      this.n = 0
      this.xv = v
    }
  }

  mostra() {
    if (games.cT != "pot") {
      if (this.c == "red") {
        fill(255, 0, 0)
      } else if (games.cT != "sF" || games.p < games.delay) {
        fill(0)
      } else {
        colorMode(HSB)
        fill(random(360), 50, 50)
        colorMode(RGB)
      }
      rect(this.x, this.y, this.w, this.w)
    } else {
      if (this.c == "red") {
        if (this.sopra) {
          image(img2, this.x - this.w, this.y - this.w, this.w * 8, this.w * 8)
        } else {
          image(img, this.x - this.w, this.y - this.w * 7, this.w * 8, this.w * 8)
        }
      } else {
        fill(0)
        rect(this.x, this.y, this.w, this.w)
      }
    }
  }

  muovi() {
    if (this.c == "red") {
      this.x -= games.v
    } else {
      this.x -= this.xv
      this.xv += map(noise(this.n), 0, 1, -0.5, 0.5)
      this.xv *= 0.9975
      this.n += 0.1
    }
  }

  resetta() {
    if (this.c == "red") {
      this.x = games.w.tutto / 2
      if (random() > 0.5) {
        this.y = this.w * 2
        this.sopra = true
      } else {
        this.y = -this.w * 2
        this.sopra = false
      }
    } else {

      /*
      if (this.x < 0) {
        let xp = 0
        for (let i = 0; i < games.cubi.length; i++) {
          if (games.cubi[i].x > xp)
          xp = games.cubi[i].x
        }
        this.x = xp
      } else {
        this.x = -games.w.tutto / 2
      }
    }
    */

      if (this.x < 0) {
        this.x += games.w.tutto
      } else {
        this.x += -games.w.tutto
      }
    }
  }

  out() {
    if (this.c == "red") {
      return (this.x < -games.w.tutto / 2)
    } else {
      return (this.x < -games.w.tutto / 2 || this.x > games.w.tutto / 2)
    }
  }

  in() {
    if (this.x > -games.w.p - games.w.w && this.x < -games.w.p + games.w.w) {
      if (this.sopra == games.sopra) {
        fill(0, 0, 255)
        //ellipse(this.x, this.y, 60, 60)
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}
