class Fritz {
  constructor(x, y, w, q, s, toDisplay = '', r) {
    this.segments = []

    let e = (q - 1) * s //how much space is in betwen

    let f = w - e //how much space is occupied by all segments
    let l = f / q //the length of a single segment
    let h = l * 2
    if (e >= w) {
      console.error('trop poc spazi');
    }
    if (!r) {
      r = l / 7.5
    }

    for (let i = 0; i < q; i++) {
      let xs = x + i * (l + s)
      this.segments.unshift(new Segment(xs, y, l, h, r))
    }

    this.createFont()
    this.display(toDisplay)
  }

  display(toDisplay) {
    let type = typeof toDisplay

    if (type == 'number') {
      this.display(toDisplay.toString())
    }
    if (type == 'string') {
      let str = toDisplay.split('')

      if (toDisplay.length > this.segments.length) {
        str.splice(this.segments.length)
        console.log(`${toDisplay} le trop lunc, noma ${str.join('')} al sara displeiù`);
      }
      str.reverse()

      str.forEach((char, i) => {
        if (this.font[char]) {
          this.segments[i].turn(this.font[char])
        } else {
          this.segments[i].turn(this.font[10])
          console.error('nisun ' + char)
        }
      })
    }
  }

  update() {
    this.segments.forEach(segment => {
      segment.draw()
    })
  }

  createFont() {
    this.font = [
      [1, 1, 1, 1, 1, 1, 0],  //0
      [0, 1, 1, 0, 0, 0, 0],  //1
      [1, 1, 0, 1, 1, 0, 1],  //2
      [1, 1, 1, 1, 0, 0, 1],  //3
      [0, 1, 1, 0, 0, 1, 1],  //4
      [1, 0, 1, 1, 0, 1, 1],  //5
      [1, 0, 1, 1, 1, 1, 1],  //6
      [1, 1, 1, 0, 0, 0, 0],  //7
      [1, 1, 1, 1, 1, 1, 1],  //8
      [1, 1, 1, 1, 0, 1, 1],  //9
      [0, 1, 1, 0, 1, 1, 1]   //10
    ]
    this.font['a'] = [1, 1, 1, 0, 1, 1, 1]
    this.font['b'] = [0, 0, 1, 1, 1, 1, 1]
    this.font['c'] = [1, 0, 0, 1, 1, 1, 0]
    this.font['d'] = [0, 1, 1, 1, 1, 0, 1]
    this.font['e'] = [1, 0, 0, 1, 1, 1, 1]
    this.font['f'] = [1, 0, 0, 0, 1, 1, 1]
    this.font['h'] = [0, 1, 1, 0, 1, 1, 1]
    this.font['i'] = [0, 0, 0, 0, 1, 1, 0]
    this.font['l'] = [0, 0, 0, 1, 1, 1, 0]
    this.font['n'] = [0, 0, 1, 0, 1, 0, 1]
    this.font['o'] = [0, 0, 1, 1, 1, 0, 1]
    this.font['p'] = [1, 1, 0, 0, 1, 1, 1]
    this.font['r'] = [0, 0, 0, 0, 1, 0, 1]
    this.font['u'] = [0, 1, 1, 1, 1, 1, 0]
    this.font['m'] = [1, 0, 1, 0, 1, 0, 0]
    this.font['-'] = [0, 0, 0, 0, 0, 0, 1]
  }
}

class Segment {
  constructor(x, y, w, h, r) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.r = r
    this.setupLines()
  }

  draw() {
    this.lines.forEach(line => {
      line.draw()
    })
  }

  turn(states) {
    states.forEach((state, i) => {
      this.lines[i].on = state
    })
  }

  setupLines() {
    this.lines = []
    let l = 0.2
    this.addLine(0 + l, 0, 1 - l, 0)
    this.addLine(1, 0 + l, 1, 1 - l)
    this.addLine(1, 1 + l, 1, 2 - l)
    this.addLine(1 - l, 2, 0 + l, 2)
    this.addLine(0, 2 - l, 0, 1 + l)
    this.addLine(0, 1 - l, 0, 0 + l)
    this.addLine(0 + l, 1, 1 - l, 1)
  }

  addLine(x, y, w, h) {
    this.lines.push(new Line(this.x + x * this.w, this.y + y * this.h / 2, this.x + w * this.w, this.y + h * this.h / 2, this.r))
  }
}

class Line {
  constructor(x1, y1, x2, y2, w) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.w = w
    this.on = false
  }

  draw() {
    this.on ? stroke(255, 0, 0) : noStroke()
    strokeWeight(this.w)
    line(this.x1, this.y1, this.x2, this.y2)
  }
}
