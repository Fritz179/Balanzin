class circle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.r = 1
  }

  ingrandisci() {
    let tocca = false
    for (let i = 0; i < cerchi.length - 1; i++) {
      if(sopra(cerchi[i], cerchi[cerchi.length - 1])) {
        tocca = true
      }
    }
    let x = this.x
    let y = this.y
    let r = this.r
    if (x - r > 1 && x + r < windowWidth - 1 && y - r > 1 && y + r < windowHeight - 1) {

    } else {
      tocca = true
    }
    if (!tocca) {
      this.r += 1
    }
    else {
      nuovo()
    }
  }

  mostra() {
    noFill()
    stroke(255)
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }
}

function sopra(a, b) {
  let d = dist(a.x, a.y, b.x, b.y)
  if (d < a.r + b.r) {
    return true
  } else {
    return false
  }
}
