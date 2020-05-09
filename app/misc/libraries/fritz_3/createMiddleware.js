function createMiddleware(to, name) {
  const {prototype} = to
  const runName = 'run' + capitalize(name)

  Object.defineProperty(prototype, runName, {
    get: function() {

      // add only top? function in the middle
      // const funs = this.__proto__.hasOwnProperty(name) ? [this.__proto__[name]] : []
      const funs = this.__proto__[name] ? [this.__proto__[name]] : []

      function crawl(proto) {

        // call all the capture first, from top to bottom
        if (proto.hasOwnProperty(`${name}Capture`)) {
          funs.unshift(proto[`${name}Capture`])
        }

        // call al the bubble last, from bottom to top
        if (proto.hasOwnProperty(`${name}Bubble`)) {
          funs.push(proto[`${name}Bubble`])
        }

        // recursive until to the SuperClass is passed
        if (proto.__proto__ != Object.prototype) {
          crawl(proto.__proto__)
        }
      }

      crawl(this.__proto__)

      Object.defineProperty(this.constructor.prototype, runName, {
        value: function(...args) {
          let ret
          funs.forEach(fun => {
            const out = fun.call(this, ...args, ret)
            if (typeof out != 'undefined') ret = out
          })

          return ret
        }
      });

      // console.log(this.constructor.name, funs, runName);
      return this[runName]
    },
    set: function(to) {
      console.log(to);
    }
  })
}

function createCrawlingMiddleware(to, name, allowed) {
  createMiddleware(to, name)
  createCrawler('run' + capitalize(name), allowed)
}

function addCordMiddleware({prototype}, name, q = Infinity, chunks = false) {
  const fun = prototype[name]

  Object.defineProperty(prototype, name, {
    get: function() {
      Object.defineProperty(this, name, {
        value: Object.defineProperty(fun.bind(this), 'cord', {
          value: (...args) => this[name](...args.splice(0, q).map(val => this.cord(val)), ...args)
        })
      })

      return this[name]
    }
  })
}

function addChunkMiddleware({prototype}, name, q = Infinity, chunks = false) {
  const fun = prototype[name]

  Object.defineProperty(prototype, name, {
    get: function() {
      Object.defineProperty(this, name, {
        value: Object.defineProperties(fun.bind(this), {
          cord: {
            value: (...args) => this[name](...args.splice(0, q).map(val => this.ChunkAtCord(val)), ...args)
          },
          tile: {
            value: (...args) => this[name](...args.splice(0, q).map(val => this.ChunkAtTile(val)), ...args)
          }
        })
      })

      return this[name]
    }
  })
}

function addChangeListener(to, of, listener) {
  const real = Object.getOwnPropertyDescriptor(to.__proto__, of)

  Object.defineProperty(to, of, {
    get: function() {
      return real;
    },
    set: function(value) {
      real.set.call(to, value)
      listener(value)
    }
  });
}
