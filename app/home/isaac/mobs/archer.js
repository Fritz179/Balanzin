var s;

class archer {
  constructor(s) {
    this.r = 35
    this.hp = 2
    this.offset = 3
    this.s = s
    this.points = 150
    this.bulletStats = new bulletStatArcher()
    // s (side) == 1 -> top, 2 -> bottom, 3 -> left, 4 -> right
    if (s == 1) {
      this.x = random(rooms.er + this.r, width - rooms.er - this.r)
      this.y = rooms.r + this.r
    } else if (s == 2) {
      this.x = random(rooms.er + this.r, width - rooms.er - this.r)
      this.y = height - rooms.r - this.r
    } else if (s == 3) {
      this.x = rooms.er + this.r
      this.y = random(rooms.r + this.r, height - rooms.r - this.r)
    } else {
      this.x = width - rooms.er - this.r
      this.y = random(rooms.r + this.r, height - rooms.r - this.r)
    }
  }

  muovi(i) {
    this.offset -= 0.2
    if (this.offset <= -3) {
      this.offset = 2.8
      this.spara()
    }
    if (this.s === 1) {
      this.y += this.offset * dT
    } else if (this.s === 2) {
      this.y -= this.offset * dT
    } else if (this.s === 3) {
      this.x += this.offset * dT
    } else {
      this.x -= this.offset * dT
    }
}
  mostra() {
    strokeWeight(3)
    fill(255, 0, 0)
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }

  spara() {
    let xd = players.x - this.x
    let yd = players.y - this.y
    let xs = xd * xd
    let ys = yd * yd
    let d = sqrt(xs + ys)
    let q = d / 4
    let xv = xd / q
    let yv = yd / q
    let x = this.x
    let y = this.y
    let r = this.bulletStats.r
    let t = this.bulletStats.t
    let colR = this.bulletStats.colR
    let colG = this.bulletStats.colG
    let colB = this.bulletStats.colB
    let friendly = false
    let dmg = this.bulletStats.dmg
    bullets.push(new bullet(x, y, xv, yv, r, t, colR, colG, colB, friendly, dmg))
  }

}

class bulletStatArcher{
  constructor() {
    this.r = 10
    this.t = 100
    this.colR = 255
    this.colG = 0
    this.colB = 50
    this.dmg = 1
  }
}
