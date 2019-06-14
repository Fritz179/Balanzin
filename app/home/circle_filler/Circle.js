class Circle {
  constructor({x, y}) {
    this.x = x
    this.y = y
    this.r = 1
    this.min = 4
    if (circles.length) {
      // let map = circles.map(circle => dist(circle.x, circle.y, x, y) - circle.r)
      // this.nearest = circles[map.indexOf(Math.min(...map))]
      let record = 9999999
      circles.forEach(circle => {
        let d = dist(circle.x, circle.y, x, y) - circle.r
        if (d < record) {
          record = d
          this.nearest = circle
        }
      })
    }
  }

  update() {
    if (this.validateCircle()) { //can grow
      this.r ++
    } else {
      validPos = validPos.filter(pos => dist(this.x, this.y, pos.x, pos.y) > this.r + this.min)
      updatePixelsCount(validPos.length)
      if (validPos.length) {
        circles.push(new Circle(random(validPos)))
      } else {
        noLoop()
      }
    }
  }

  mostra() {
    noFill()
    stroke(255)
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }

  validateCircle(circle) {
    if (this.nearest) {
      return (dist(this.nearest.x, this.nearest.y, this.x, this.y) > this.r + this.nearest.r && this.edge())
    } else {
      return this.edge()
    }
  }

  edge() {
    return (this.x + this.r < width &&
            this.x - this.r > 0 &&
            this.y + this.r < height &&
            this.y - this.r > 0)
  }
}
