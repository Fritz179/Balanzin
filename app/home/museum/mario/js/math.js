export class Matrix {
  constructor() {
    this.grid = []
  }

  forEach(callback) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        callback(value, x, y)
      })
    })
  }

  set(x, y, value) {
    if (!this.grid[x]) {
      this.grid[x] = []
    }
    this.grid[x][y] = value
  }

  get(x, y) {
    const col = this.grid[x]
    if (col) {
      return col[y]
    } else {
      return undefined
    }
  }
}

window.Matrix = Matrix


export class vec2 {
  constructor(x, y) {
    this.set(x, y)
  }

  set(x, y) {
    this.x = x
    this.y = y
  }
}
