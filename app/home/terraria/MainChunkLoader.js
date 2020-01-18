class MainChunkLoader extends ChunkLoader {
  constructor() {
    super()

    this.addMapModifier(this.generateTree, {chance: 4, min: 8, pre: 1, linear: true})
    this.addMapModifier(this.generateCoalOrePach, {chance: 30, min: 10, pre: 1, linear: false})
    this.addMapModifier(this.generateIronOrePach, {chance: 600, min: 10, pre: 1, linear: false})
    this.addMapModifier(this.generateDiamonOrePach, {chance: 500, min: 30, pre: 1, linear: false})
  }

  chunkLoader(x, y) {
    const data = []

    function tileAt(x, y) {
      let distToTop = y -noise(x / 20) * 50

      if (distToTop < 0) return 0
      if (distToTop < 1) return 1
      if (distToTop < 4) return 2
      else return 3
    }

    for (let xb = 0; xb < 16; xb++) {
      for (let yb = 0; yb < 16; yb++) {
        data[xb + yb * 16] = tileAt(x * 16 + xb, y * 16 + yb)
      }
    }

    return data
  }

  generateTree(x, add, rnd) {
    const y = floor(noise((x) / 20) * 50)
    const height = floor(rnd(4)) + 4
    let leafBottom = floor(rnd(0.5, height / 2) + height / 3)
    let offset = 1

    for (let i = 0; i < height; i++) {
      add({x, y: y - i, to: 4})
    }

    while (leafBottom < height) {
      for (let i = leafBottom; i < height; i++) {
        add({x: x + offset, y: y - i, to: 5})
        add({x: x - offset, y: y - i, to: 5})
      }

      leafBottom++
      offset++
    }

    offset = offset > 2 ? offset : 2
    leafBottom = height
    const leafTop = leafBottom + floor(rnd(offset * 2)) + 2

    while (offset > 0) {
      for (let i = 1; i < offset; i++) {
        add({x: x + i, y: y - leafBottom, to: 5})
        add({x: x - i, y: y - leafBottom, to: 5})
      }
      add({x: x, y: y - leafBottom, to: 5})

      offset -= floor(rnd(0.5, 2))
      leafBottom++
    }
  }

  generateCoalOrePach(x, y, add, rnd) {
    const top = floor(noise((x) / 20) * 50)

    if (y > top + 10) {
      let width = rnd(2)
      let height = rnd(2)

      for (let i = floor(-width); i <= width; i += floor(rnd(1, 2.5))) {
        for (let j = floor(-height); j <= height; j += floor(rnd(1, 2.5))) {
          add({x: x + i, y: y + j, to: 6, hard: true})
        }
      }
    }
  }

  generateIronOrePach(x, y, add, rnd) {
    const top = floor(noise((x) / 20) * 50)

    if (y > top + 10) {
      let width = rnd(2)
      let height = rnd(2)

      for (let i = floor(-width); i <= width; i += floor(rnd(1, 2.5))) {
        for (let j = floor(-height); j <= height; j += floor(rnd(1, 2.5))) {
          add({x: x + i, y: y + j, to: 7, hard: true})
        }
      }
    }
  }

  generateDiamonOrePach(x, y, add, rnd) {
    const top = floor(noise((x) / 20) * 50)

    if (y > top + 30) {
      let width = rnd(2)
      let height = rnd(2)

      for (let i = floor(-width); i <= width; i += floor(rnd(1, 2.5))) {
        for (let j = floor(-height); j <= height; j += floor(rnd(1, 2.5))) {
          add({x: x + i, y: y + j, to: 8, hard: true})
        }
      }
    }
  }
}
