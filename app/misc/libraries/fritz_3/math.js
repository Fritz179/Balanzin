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

const cap = (num, min, max) => Math.min(Math.max(num, min), max)

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
  if (x instanceof Vec2 || Array.isArray(x)) return x

  if (typeof y == 'undefined') y = x

  return [x, y]
}

class Vec2 {
  constructor(x = 0, y) {
    [x, y] = getXY(x, y)

    this.x = x
    this.y = y

    this.px = x
    this.py = y
  }

  *[Symbol.iterator]() {
    yield this.x
    yield this.y
  }

  get [0]() { return this.x }
  get [1]() { return this.y }

  set [0](x) { return this.x = x }
  set [1](y) { return this.y = y }

  get hasChanged() { return this.changed ? this.stagnate() : false}
  get changed() { return this.x != this.px || this.y != this.py }

  stagnate() {
    this.px = this.x
    this.py = this.y
    return this
  }

  set(x, y) {
    [x, y] = getXY(x, y)

    this.x = x
    this.y = y
    return this
  }

  add(x, y) {
    [x, y] = getXY(x, y)

    this.x += x
    this.y += y
    return this
  }

  sub(x, y) {
    [x, y] = getXY(x, y)

    this.x -= x
    this.y -= y
    return this
  }

  mult(x, y) {
    [x, y] = getXY(x, y)

    this.x *= x
    this.y *= y
    return this
  }

  div(x, y) {
    [x, y] = getXY(x, y)

    this.x /= x
    this.y /= y
    return this
  }

  reset(stagnate) {
    this.x = 0
    this.y = 0

    if (!stagnate) return this

    return this.stagnate()
  }

  equals(x, y) {
    [x, y] = getXY(x, y)

    return this.x == x && this.y == y
  }

  magSq() {
    return this.x * this.x + this.y * this.y
  }

  mag() {
    return Math.sqrt(this.magSq())
  }

  normalize() {
    return this.setMag(1)
  }

  setMag(mag = 1) {
    const len = this.mag()

    if (len == 0) {
      console.error('Cannot setMag of Vec2 with no length')
      return this
    }

    return this.div(len)
  }

  cap(min, max) {
    this.x = cap(this.x, min, max)
    this.y = cap(this.y, min, max)
    return this
  }
}

function addVec2(target, name, dim1, dim2) {
  const {prototype} = target
  const capName = capitalize(name);

  class CustomVec extends Vec2 {
    constructor(x, y) {
      super(x, y)
    }

    listen(fun1, fun2) {
      if (!fun2) fun2 = fun1

      if (typeof Object.getOwnPropertyDescriptor(this, 'x').value != 'undefined') {
        let x = this.x, y = this.y

        Object.defineProperties(this, {
          x: {
            get: function() { return x },
            set: function(to) { if (x != to) { fun1(x = to, false) } },
            configurable: true
          },
          y: {
            get: function() { return y },
            set: function(to) { if (y != to) { fun2(y = to, true) } },
            configurable: true
          }
        })
      } else {
        const xDesc = Object.getOwnPropertyDescriptor(this, 'x')
        const yDesc = Object.getOwnPropertyDescriptor(this, 'y')

        Object.defineProperties(this, {
          x: {
            set: function(to) { fun1(to, false); xDesc.set(to) },
            configurable: true
          },
          y: {
            set: function(to) { fun2(to, true); yDesc.set(to) },
            configurable: true
          }
        })
      }
    }
  }

  // attach getters and setters to CustomVec
  if (dim1 != 'x' && dim2 != 'y') {
    Object.defineProperties(CustomVec.prototype, {
      [dim1]: {
        get: function() { return this.x },
        set: function(x) { this.x = x }
      },
      [dim2]: {
        get: function() { return this.y },
        set: function(y) { this.y = y }
      }
    })
  }

  // attach custom getter and setter to class
  Object.defineProperties(prototype, {
    [dim1]: {
      get: function() { return this[name].x },
      set: function(val) { this[name].x = val }
    },
    [dim2]: {
      get: function() { return this[name].y },
      set: function(val) { this[name].y = val }
    }
  });

  // attach getters to class
  ['hasChanged', 'changed'].forEach(getName => {
    Object.defineProperty(prototype, getName + capName, {
      get: function() { return this[name][getName] }
    });
  });

  // attach functions to class that return class
  ['set', 'add', 'sub', 'mult', 'div', 'magSq', 'mag', 'setMag', 'normalize', 'reset', 'stagnate', 'cap'].forEach(funName => {
    prototype[funName + capName] = function(...to) { this[name][funName](...to); return this; }
  });

  // attach functions to class that return default return
  ['equals'].forEach(funName => {
    prototype[funName + capName] = function(...to) { return this[name][funName](...to) }
  });

  // attach trap for Vec2 init in class
  Object.defineProperty(prototype, name, {
    set: function([x, y]) {
      const thisVec = new CustomVec(x, y)

      // attach trap for new values
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
