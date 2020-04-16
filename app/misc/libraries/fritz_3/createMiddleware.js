function createMiddleware(to, name) {
  const {prototype} = to
  const capName = 'run' + capitalize(name)

  Object.defineProperty(prototype, capName, {
    get: function() {
      const funs = this.hasOwnProperty(name) ? [prototype[name]] : []
      console.log(funs, name);

      function crawl(proto) {
        if (proto.hasOwnProperty(`${name}Capture`)) {
          funs.unshift(proto[`${name}Capture`])
        }

        if (proto.hasOwnProperty(`${name}Bubble`)) {
          funs.push(proto[`${name}Bubble`])
        }

        // recursive until to the SuperClass is passed
        if (proto.__proto__ != Object.prototype) {
          crawl(proto.__proto__)
        }
      }

      crawl(prototype)
      Object.defineProperty(this.constructor.prototype, capName, {
        value: function(args = {}) {
          let ret
          funs.forEach(fun => {
            const out = fun.call(this, args, ret)
            if (typeof out != 'undefined') ret = out
          })

          return ret
        }
      });

      return this[name]
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
