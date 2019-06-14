function preload() {
  console.log('preload');
  loadSpriteSheet('tiles', {type: 'pacmanTiles', json: false})
  loadSpriteSheets('player', 'end', 'shooter', 'bullet')

  loadMenuSprite('mainMenu')
  loadMenuSprite('levelSelection')
}

function setup() {
  createStatus(MainMenu)
  createStatus(LevelSelection)
  createStatus(Play)
  createStatus(Create)

  setCurrentStatus('mainMenu')
}

class Play extends MapGame {
  constructor() {
    super()

    this.setSize(480, 270)
    this.cameraSettings({w: 480, r: 16 / 9, smooth: false})
    cameraSettings({smooth: false})

    this.createSpawners(Shooter, Bullet, Player, End)

    this.listen('onClick')
  }

  onClick() {
    console.log(this.tileX, this.tileY, this.block);
  }

  pre(map) {
    this.setMap(parseMap(map, 'pacman'))

    masterStatus.setSize(480, 270)
    masterStatus.cameraSettings({w: 480, r: 16 / 9, mode: 'multiple'})
  }

  post() {
    masterStatus.setSize(1920, 1080)
    masterStatus.cameraSettings({w: 1920, r: 16 / 9, mode: 'auto'})
  }
}

const startingMap = {shapes: {point: {0: [[1, 1]]}}}

class Create extends MapGame {
  constructor() {
    super()

    // this.ecs.createSpawners(Shooter, Bullet, Player, End)
    this.listen('onMouse', 'click', 'onWheel')
  }

  pre() {
    this.setMap(parseMap(startingMap, 'pacman'))
  }

  onMouse() {
    console.log(this.tileX, this.tileY);
  }

  onClick() {

  }

  onClickDragged() {
    const xd = this.cameraX - this.pcameraX
    const yd = this.cameraY - this.pcameraY
    this.camera.setPos(this.camera.x - xd / this.camera.multiplierX, this.camera.y - yd / this.camera.multiplierY)
  }

  onClickReleased() {

  }

  onWheel(dir) {
    console.log(dir);
  }
}
