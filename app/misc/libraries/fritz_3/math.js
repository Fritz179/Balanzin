/*
  Expose common Math function to global
  Better random function
  Vec 2
*/

const {PI, abs, min, max, sign} = Math

// expand to be called with arrays or multiple arguments
const [floor, round, ceil] = ['floor', 'round', 'ceil'].map(funName => (...args) => {
  if (args.length > 1) {
    return args.map(x => Math[funName](x))
  } else if (Array.isArray(args[0])) {
    return args[0].map(x => Math[funName](x))
  } else {
    return Math[funName](args[0])
  }
})

const minMax = (values, cycle) => {
  console.assert(cycle, 'No cycle')
  return values.map((x, i) => i < cycle ? Math.floor(x) : Math.ceil(x))
}
// expand to be called with multiple arguments or
// to chose a random element from an array
const random = (...args) => {
  if (args.length == 0) {
    return Math.random()
  } else if (args.length == 1) {
    if (Array.isArray(args[0])) {
      return args[0][Math.floor(Math.random() * min.length)]
    } else {
      return Math.random() * args[0]
    }
  } else {
    return Math.random() * (args[1] - args[0]) + args[0]
  }
}

const xTable = {left: 0, right: 1, center: 0.5}
const yTable = {top: 0, bottom: 1, center: 0.5}
function getAlign(align) {
  if (align == 'center') align = 'center-center'
  else if (align == 'top') align = 'top-center'
  else if (align == 'right') align = 'center-right'
  else if (align == 'bottom') align = 'bottom-center'
  else if (align == 'left') align = 'center-left'

  const x = xTable[align.split('-')[1]] || 0
  const y = yTable[align.split('-')[0]] || 0

  return [x, y]
}

function getXY(x, y) {
  if (Array.isArray(x)) {
    return x
  }

  if (typeof y == 'undefined') y = x

  return [x, y]
}

class Vec2 extends Array {
  constructor(x = 0, y) {
    if (typeof y == 'undefined') y = x

    super(x, y)
  }

  get x() { return this[0] }
  get y() { return this[1] }

  set x(x) { this[0] = x }
  set y(y) { this[1] = y }

  get hasChanged() { return this.changed ? this.stagnate() : false}
  get changed() { return this[0] != this[2] || this[1] != this[3] }

  stagnate() {
    this[2] = this[0]
    this[3] = this[1]
    return this
  }

  set(x, y) {
    [x, y] = getXY(x, y)

    this[0] = x
    this[1] = y
    return this
  }

  add(x, y) {
    [x, y] = getXY(x, y)

    this[0] += x
    this[1] += y
    return this
  }

  sub(x, y) {
    [x, y] = getXY(x, y)

    this[0] -= x
    this[1] -= y
    return this
  }

  mult(x, y) {
    [x, y] = getXY(x, y)

    this[0] *= x
    this[1] *= y
    return this
  }

  div(x, y) {
    [x, y] = getXY(x, y)

    this[0] /= x
    this[1] /= y
    return this
  }

  reset() {
    this[0] = 0
    this[1] = 0
    return this
  }

  equals(x, y) {
    [x, y] = getXY(x, y)

    return this[0] == x && this[1] == y
  }

  magSq() {
    return this[0] * this[0] + this[1] * this[1]
  }

  mag() {
    return Math.sqrt(this.magSq())
  }

  normalize() {
    const len = this.mag()

    if (len !== 0) this.mult(1 / len)
    return this
  }

  setMag(mag) {
    return this.normalize.mult(mag)
  }

  cap(min, max) {
    this[0] = this[0] < min ? min : this[0] > max ? max : this[0]
    this[1] = this[1] < min ? min : this[1] > max ? max : this[1]
  }

  copy() {
    return new Vec2(this[0], this[1])
  }
}


function addVec2(target, name, dim1, dim2) {
  const {prototype} = target
  const capName = capitalize(name);

  class CustomVec extends Vec2 {
    constructor(x, y) {
      super(x, y)
    }

    get [dim1]() { return this[0] }
    get [dim2]() { return this[1] }

    set [dim1](x) { this[0] = x }
    set [dim2](y) { this[1] = y }

    bind(binded, dim1, dim2) {
      let x = this[0], y = this[1]
      const setX = px ? to => binded[dim1] = (x = to) + 'px' : to => binded[dim1] = x = to
      const setY = px ? to => binded[dim2] = (y = to) + 'px' : to => binded[dim2] = y = to

      Object.defineProperties(this, {
        0: {
          get: function() { return x },
          set: to => { if (to != x) setX(to) }
        },
        1: {
          get: function() { return y },
          set: to => { if (to != y) setY(to) }
        }
      })
    }

    listen(fun1, fun2) {
      if (!fun2) fun2 = to => fun1(to, true)
      let x = this[0], y = this[1]

      Object.defineProperties(this, {
        0: {
          get: function() { return x },
          set: to => { if (to != x) fun1(x = to) }
        },
        1: {
          get: function() { return y },
          set: to => { if (to != y) fun2(y = to) }
        }
      })
    }
  }


  // return attached class
  ['set', 'add', 'sub', 'mult', 'div', 'magSq', 'mag', 'setMag', 'normalize', 'reset', 'stagnate', 'cap'].forEach(funName => {
    prototype[funName + capName] = function(...to) { this[name][funName](...to); return this; }
  });

  // return customVec instance
  ['equals', 'copy'].forEach(funName => {
    prototype[funName + capName] = function(...to) { return this[name][funName](...to) }
  });


  ['hasChanged', 'changed'].forEach(getName => {
    Object.defineProperty(prototype, getName + capName, {
      get: function() { return this[name][getName] }
    });
  })

  Object.defineProperty(prototype, dim1, {
    get: function() { return this[name][0] },
    set: function(val) { this[name][0] = val }
  });

  Object.defineProperty(prototype, dim2, {
    get: function() { return this[name][1] },
    set: function(val) { this[name][1] = val }
  });

  Object.defineProperty(prototype, name, {
    set: function([x, y]) {
      const thisVec = new CustomVec(x, y)

      Object.defineProperty(this, name, {
        get: function() { return thisVec },
        set: function(to) {
          if (Array.isArray(to) || typeof to != 'object') {
            thisVec.set(to)
          } else {
            const x = typeof to[dim1] != 'undefined' ? to[dim1] : to.x
            const y = typeof to[dim2] != 'undefined' ? to[dim2] : to.y
            thisVec.set(x, y)
          }

          return thisVec
        }
      });
    }
  })
}
