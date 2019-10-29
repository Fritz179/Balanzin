
function playerTutto() {
  players.muovi()
  players.mostra()
  players.update()
}

class player {
  constructor(x, y, r) {
    this.invulnerabile = -1
    this.x = width / 2
    this.y = height / 2
    this.r = 25
    this.speed = 5
    this.hp = 4
    this.bulletStats = new bulletStat()

  }

  muovi() {
    if (keyIsDown(83)) {
      this.y += this.speed * dT
    }
    if (keyIsDown(87)) {
      this.y -= this.speed * dT
    }
    if (keyIsDown(68)) {
      this.x += this.speed * dT
    }
    if (keyIsDown(65)) {
      this.x -= this.speed * dT
    }

    if (this.y + this.r > height - rooms.r) {
      this.y = height - rooms.r - this.r
    }
    if (this.y - this.r < rooms.r) {
      this.y = rooms.r + this.r
    }
    if (this.x + this.r > width - rooms.er) {
      this.x = width - rooms.er - this.r
    }
    if (this.x - this.r < rooms.er) {
      this.x = rooms.er + this.r
    }
  }

  mostra() {
    strokeWeight(3)
    if (this.invulnerabile > 1) {
      if (this.invulnerabile % 10 < 5) {
        fill(255, 70, 70)
      } else {
        fill(255, 153, 153)
      }
    } else {
      fill(255, 153, 153)
    }
    stroke(0)
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }

  update() {
    if (keyIsDown(37) && this.bulletStats.countdown <= 0) {
      this.spara(-10, 0)
    }
    if (keyIsDown(38) && this.bulletStats.countdown < 0) {
      this.spara(0, -10)
    }
    if (keyIsDown(39) && this.bulletStats.countdown < 0) {
      this.spara(10, 0)
    }
    if (keyIsDown(40) && this.bulletStats.countdown < 0) {
      this.spara(0, 10)
    }
    this.bulletStats.countdown -= 0.5 * dT
    for (let i = 0; i < enemys.length; i++) {
      if (players.touchEnemy(enemys[i]) && this.invulnerabile <= 0) {
        sounds.damage.play()
        this.hp -=1
        this.invulnerabile = 100
        if (this.hp == 2) {
          sounds.heart.amp(3)
          sounds.heart.loop()
        } else if (this.hp == 1) {
          sounds.heart.amp(3)
        }
      }
    }
    if (this.hp <= 0) {
      sounds.heart.stop()
      finito = true
      vinto = false
    }
    if (this.invulnerabile >= 0) {
      this.invulnerabile -= 1  * dT
    }
  }

  spara(xv, yv) {
    this.bulletStats.countdown = 10
    let x = this.x
    let y = this.y
    let r = this.bulletStats.r
    let t = this.bulletStats.t
    let colR = this.bulletStats.colR
    let colG = this.bulletStats.colG
    let colB = this.bulletStats.colB
    let friendly = true
    let dmg = this.bulletStats.dmg
    bullets.push(new bullet(x, y, xv, yv, r, t, colR, colG, colB, friendly, dmg))
  }

  touchEnemy(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y)
    if (d < this.r + enemy.r) {
      return true
    } else {
      return false
    }
  }
}

class bulletStat{
  constructor() {
    this.countdown = -1
    this.countdownFixed = 10
    this.r = 10
    this.t = 10
    this.colR = 204
    this.colG = 0
    this.colB = 102
    this.dmg = 1
  }
}
