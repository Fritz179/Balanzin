function preload() {
  loadSpriteSheet('tiles', {type: 'tiles'})
  loadSpriteSheets('player')

  loadMenuSprite('mainMenu')

  loadMap('level_0')
}

function setup() {
  createStatus(MainMenu)
  createStatus('play', Terraria)

  setCurrentStatus('mainMenu')
}

class Terraria extends ChunkGame {
  constructor() {
    super()
    this.setSize(1920, 1080)

    this.cameraSettings({w: 960, r: 16 / 9, mode: 'multiple', overflow: 'hidden'})

    this.ecs.spawn(new Player(0, -110 * 16, this))
    this.settings({preW: 2, preH: 2, postW: 2, postH: 2})

    this.listen('onClick', 'onWheel')

    this.collisions = [0, 15, 15, 15]
  }

  onWheel(dir) {
    console.log(dir);
  }

  onClick() {
    this.tile = 0
  }

  update() {
    smooth()
  }

  pre() {
    masterStatus.cameraSettings({mode: 'original'})
  }

  post() {
    masterStatus.cameraSettings({mode: 'auto'})
  }

  loadChunkAt(x, y) {
    const div = 10
    const chunk = {graphicalMap: [], w: 16, h: 16}

    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        chunk.graphicalMap[j * 16 + i] = tileAt(x * 16 + i, y * 16 + j)
      }
    }

    function tileAt(x, y) {
      let top = y - noise(x / 20) * 50
      if (top < -110) return 0
      if (top < -109) return 1
      if (top < -103) return 2
      else return 3
      // else return round(noise(x / div, y / div))
    }

    return chunk
  }

  // loadChunkAt(x, y) {
  //   const div = 100
  //   const chunk = {graphicalMap: [], w: 16, h: 16}
  //   for (let i = 0; i < 16; i++) {
  //     for (let j = 0; j < 16; j++) {
  //       chunk.graphicalMap[j * 16 + i] = round(noise((x * 16 + i) / div, (y * 16 + j) / div))
  //     }
  //   }
  //
  //   return chunk
  // }
}
