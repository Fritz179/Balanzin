/*
  Chunk:
    - data: Array(16*16)
    - entities: Array()
*/

class ChunkLoader {
  constructor() {
    this.bufferedChunks = {}
    this.chunkModifiers = {}
    this.mapModifiers = []

    this.baseChunkLoader = this.chunkLoader
    this.chunkLoader = this.chunkLoaderReplacer

    this.blockAdder = this.blockAdder.bind(this)
  }

  chunkLoaderReplacer(x, y) {
    const id = `${x}_${y}`

    // generate new chunk
    const chunk = {
      data: [],
      entities: []
    }

    // if chunk was previously offloaded
    if (this.bufferedChunks[id]) {
      if (this.bufferedChunks[id].data && this.bufferedChunks[id].data.length) {
        return this.bufferedChunks[id]
      } else {
        chunk.entities = this.bufferedChunks[id].entities
      }
    }

    chunk.data = this.baseChunkLoader(x, y)

    if (!this.chunkModifiers[id]) this.chunkModifiers[id] = []

    this.mapModifiers.forEach(modifier => {
      if (modifier.linear) {
        const {pre, done} = modifier

        for (let i = -pre; i <= pre; i++) {
          // if already modified, return
          if (done[x + i]) continue
          done[x + i] = true

          this.runLinearModifier(modifier, x + i)
        }
      } else {
        const {preX, preY, done} = modifier

        for (let i = -preX; i <= preX; i++) {
          for (let j = -preY; j <= preY; j++) {
            const id = `${x + i}_${y + j}`
            // if already modified, return
            if (done[id]) continue
            done[id] = true

            this.runCrossModifier(modifier, x + i, y + j)
          }
        }
      }
    })

    this.chunkModifiers[id].forEach(({index, to, hard}) => {
      if (hard || !chunk.data[index]) {
        chunk.data[index] = to
      }
    })

    return chunk
  }

  runLinearModifier({fun, chance, min}, x) {
    if (!chance) {
      fun(x, blockAdder, getNextPerlin)
    } else {

      // for every tile in chunk
      for (let xTile = x * 16; xTile < x * 16 + 16; xTile++) {
        if (fnoise(xTile) > chance) {
          let flag = true

          // if it is a candidate, check for a min ditance between other candidates
          if (min) {
            const curr = fnoise(xTile)
            for (let i = -min; i <= min; i++) {
              if (fnoise(xTile + i) > curr) {
                // if there is a higher nuber nearby, deny this candidate
                flag = false
                break
              }
            }
          }

          // if it can spawn
          if (flag) {
            fun(xTile, this.blockAdder, generateFnoiseGetter(x * 16 + xTile))
          }
        }
      }
    }
  }

  runCrossModifier({fun, chance, minX, minY}, x, y) {
    if (!chance) {
      fun(x, y, blockAdder, getNextPerlin)
    } else {
      const scl = 2
      const fnoiseAt = (xOff, yOff) => fnoise(x * 16 + xOff, y * 16 + yOff)

      // for every tile in chunk
      for (let xTile = x * 16; xTile < x * 16 + 16; xTile++) {
        for (let yTile = y * 16; yTile < y * 16 + 16; yTile++) {
          if (fnoiseAt(xTile, yTile) > chance) {
            let flag = true

            // if it is a candidate, check for a min ditance between other candidates
            if (minX || minY) {
              const curr = fnoiseAt(xTile, yTile)

              check_block: {
                for (let i = -minX; i <= minX; i++) {
                  for (let j = -minY; j <= minY; j++) {
                    if (fnoiseAt(xTile + i, yTile + j) > curr) {
                      // if there is a higher nuber nearby, deny this candidate
                      flag = false
                      break check_block
                    }
                  }
                }
              }
            }

            // if it can spawn
            if (flag) {
              fun(xTile, yTile, this.blockAdder, generateFnoiseGetter(xTile, yTile))
            }
          }
        }
      }
    }
  }

  chunkOffloader(data, x, y) {
    const id = `${x}_${y}`

    this.bufferedChunks[id] = {
      data: data.data.length ? data.data : this.bufferedChunks[id] && this.bufferedChunks[id].data || [],
      entities: data.entities || []
    }
  }

  addMapModifier(fun, {linear = false, chance = 0, pre = 0, min = 0, minX = 0, minY = 0, preX = 0, preY = 0}) {
    chance = 1 - 1 / (chance + 1)

    if (linear) {
      this.mapModifiers.push({fun, done: {}, pre, chance, min, linear})
    } else {
      if (!preX && pre) preX = pre
      if (!preY && pre) preY = pre
      if (!minX && min) minX = min
      if (!minY && min) minY = min

      this.mapModifiers.push({fun, done: {}, preX, preY, minX, minY, chance, min, linear})
    }
  }

  chunkLoader(x, y) {
    throw new Error('Please add a chunkLoader function!!\nThis function is used for getting the baseChunk')
  }

  blockAdder({x, y, to, hard = false}) {
    const index = (x % 16 + 16) % 16 + (y % 16 + 16) % 16 * 16
    const chunkX = floor(x / 16), chunkY = floor(y / 16)

    const id = `${chunkX}_${chunkY}`

    if (!this.chunkModifiers[id]) this.chunkModifiers[id] = []
    this.chunkModifiers[id].push({index, to, hard})
  }
}

function perlinAt(num) {
  return perlin[(num % perlin.length + perlin.length) % perlin.length]
}

function generateFnoiseGetter(x, y = 0) {
  let noiseCount = 0

  return (...args) => {
    if (args.length == 0) {
      return fnoise(x + noiseCount++, y)
    } else if (args.length == 1) {
      return fnoise(x + noiseCount++, y) * args[0]
    } else {
      return fnoise(x + noiseCount++, y) * (args[1] - args[0]) + args[0]
    }
  }
}
