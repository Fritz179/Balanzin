function createMiddleware(to, name) {
  const capName = capitalize(name)

  const {prototype} = to.constructor
  if (!prototype.hasOwnProperty(`${name}MiddlewareAdded`)) {
    Object.defineProperty(prototype, `${name}MiddlewareAdded`, {value: true})
    // console.log(Object.hasOwnProperty(prototype, `${name}MiddlewareAdded`), to);

    function crawl(obj) {
      if (obj.hasOwnProperty(`${name}Capture`)) {
        funs.unshift(obj[`${name}Capture`])
      }

      if (obj.hasOwnProperty(`${name}Bubble`)) {
        funs.push(obj[`${name}Bubble`])
      }

      // recursive until to the SuperClass is passed
      if (obj.__proto__ != Object.prototype) {
        crawl(obj.__proto__)
      }
    }

    const funs = prototype[name] ? [prototype[name]] : []
    crawl(prototype)

    Object.defineProperty(prototype, name, {
      value: function(args = {}) {
        let ret
        funs.forEach(fun => {
          const out = fun.call(this, args, ret)
          if (typeof out != 'undefined') ret = out
        })

        return ret
      }
    })
  }
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
