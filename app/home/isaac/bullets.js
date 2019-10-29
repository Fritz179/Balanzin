var splashes = [];

function bulletsTutto() {
  for (let i = bullets.length -1; i >= 0; i--) {
    bullets[i].muovi()
    bullets[i].mostra()
    if (bullets[i].friendly == true) {
      for (let j = enemys.length -1; j >= 0; j--) {
        if (bullets[i].hitsEnemy(enemys[j])) {
          sounds.arrow.play()
          enemys[j].hp -= bullets[i].dmg
          bullets[i].nuovoSplash()
          bullets[i].toSplice = true
        }
      }
    } else if (bullets[i].hitsEnemy(players) && players.invulnerabile <= 0) {
      sounds.vibrate.play()
      bullets[i].toSplice = true
      players.hp -= bullets[i].dmg
      if (players.hp == 2) {
        sounds.heart.amp(3)
        sounds.heart.loop()
      } else if (players.hp == 1) {
        sounds.heart.amp(3)
      }
      players.invulnerabile = 100
      bullets[i].nuovoSplash()
    }
    if (bullets[i].bordo()) {
      bullets[i].nuovoSplash()
      bullets[i].toSplice = true
    }
    if (bullets[i].toSplice == true) {
      bullets.splice(i, 1)
    }
  }
}

function splashesTutto() {
  for (let i = splashes.length - 1; i >= 0; i--) {
    splashes[i].mostra()
    splashes[i].muovi()
    if (splashes[i].a < 10) {
      splashes.splice(i, 1)
    }
  }
}

class bullet {
  constructor(x, y, xv, yv, r, t, colR, colG, colB, friendly, dmg) {
    this.toSplice = false
    this.dmg = dmg
    this.x = x
    this.y = y
    this.xv = xv
    this.yv = yv
    this.colR = colR
    this.colG = colG
    this.colB = colB
    this.r = r
    this.t = t
    this.friendly = friendly
  }

  muovi() {
    this.x += this.xv * dT
    this.y += this.yv * dT
    this.t -= 0.5 * dT
  }

  mostra() {
    fill(this.colR, this.colG, this.colB)
    strokeWeight(4)
    stroke(0)
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }

  hitsEnemy(e) {
  let d = dist(this.x, this.y, e.x, e.y)
  if (d < this.r + e.r) {
    return true
    } else {
    return false
    }
  }

  bordo() {
    if (this.t < 0 || this.x - this.r < rooms.er || this.x + this.r > width - rooms.er || this.y - this.r < rooms.r || this.y + this.r > height - rooms.r ) {
      return true
    } else {
      return false
    }
  }

  nuovoSplash() {
    for (let i = 0; i < 20; i++) {
      splashes.push(new splash(this.x, this.y, this.r / 1.5, this.colR, this.colG, this.colB))
    }
  }
}

class splash{
  constructor(x, y, r, colR, colG, colB) {
    this.x = x
    this.y = y
    this.xv = random(-0.7, 0.7)
    this.yv = random(-0.7, 0.7)
    this.r = r
    this.colR = colR
    this.colG = colG
    this.colB = colB
    this.a = 255
  }

  muovi() {
    this.x += this.xv * dT
    this.y += this.yv * dT
    this.a -= 6 * dT
  }

  mostra() {
    noStroke()
    fill(this.colR, this.colG, this.colB, this.a)
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }
}
