var s;

class bomber {
  constructor(s) {
    this.r = 35
    this.hp = 4
    this.speed = 2
    this.points = 100
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

  muovi() {
    if (players.x < this.x) {
      this.x -= this.speed * dT
    }
    if (players.x > this.x) {
      this.x += this.speed * dT
    }
    if (players.y < this.y) {
      this.y -= this.speed * dT
    }
    if (players.y > this.y) {
      this.y += this.speed * dT
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
    fill(153, 0, 153)
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }
}
