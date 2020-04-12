createGame({type: 'pacman', levels: true, tileWidth: 16, cameraMode: 'multiple', cameraOverflow: 'hidden', cameraRatio: 16/9, cameraWidth: 480})
createSpawners(Shooter, Bullet)

let playerSpawner = createSpawner(Player), player

function preload() {
  createMenu('mainMenu')
  loadSpriteSheet('tiles', {type: 'tiles', json: false})
  loadSpriteSheet('player', {type: 'animations'})
  loadSpriteSheet('shooter', {type: 'animations'})
  loadSpriteSheet('bullet', {type: 'animations'})
  loadMap('level_0')
  //loadAndSetMap('level_0')
}

function setup() {
  changeStatus('mainMenu')
  onStatusChange('play', () => {
    setmap('level_0')
    player = playerSpawner.spawn().setPos(16, 16)
    // player = spawners.player.spawn().setPos(200, 200)
    // player = spawnOne(Player).setPos(200, 200)
    follow(player)
    listenInput(player, 'play')
  })
}

//zoom 110%?

// TODO: 'update' README

// TODO: createPool => set global reference, return reference add to game.pools or game.spawners (pool class with reset)
// pool return => {pool, storeAll, poolSize, activeSize, set(options)}

// TODO: loadLevel retunrs {start()}

// TODO: create Menu and status

// TODO: chek if correct
// if (killed1 && killed2) {i--; break}
// else if (killed1) break
// else if (killed2) i--

// let playerSpawner = createSpawner(Player), player
createSpawners(Shooter, Bullet, Player, End)

function preload() {
  loadSpriteSheet('tiles', {type: 'pacmanTiles', json: false})
  loadSpriteSheets('player', 'End', 'shooter', 'bullet')
  loadMap('level_0')

  createStatus('mainMenu', status => {
    status.createMenu('mainMenu')
  })

  createStatus('levelSelection', status => {
    status.createMenu('levelSelection', LevelSelection, {}) // {json: false, callback?, }
  })

  createStatus('play', () => {
    cameraSettings({ratio: 16 / 9})
    createGame('pacman', {tileWidth: 16})
    addForegroundLayer(canvas => {

    })
    preFunction(() => {

    })
    postFunction(() => {

    })
    onMapLoad(map => {
      spawners.players.spawn(map.playerX, map.playerY)
    })

  })

  setCurrentStatus('mainMenu')
}

class CustomEntity extends Entity {
  constructor() {
    this.collideWith([])
    this.dontCollideWith([])

    this.setSize()
    this.setPos()
    this.setVel()
    this.affectedByGravity = false

    this.listen('all', 'click', 'key', 'mouse')

    this.onClick = () => console.log("i've been clicked");
    this.onClickDragged = () => console.log("I've been dragged");
    this.onClickReleased = () => console.log("I've been released");

    this.onKey = key => console.log(`key: ${key} has been pressed`);
    this.onKeyReleased = key => console.log(`key: ${key} has been released`);

    this.onMouse = () => console.log('Mouse has been clicked');
    this.onMouseDragged = () => console.log('Mouse has been dragged');
    this.onMouseReleased = () => console.log('Mouse has been clicked');
  }
}


//camera extends Master
//x1 e x2 = gamePos w, w1
//x3 e x4 = spritePos w2
//x5 e x6 = realPos? w3

//w1 = hitboxGame w
//w2 = sprite
//w3 = sprite

//x0 xO

//setForm('rect', 'circle')

//Master extends:
  //Animations
    //entity
    //Status
    //game
    //menu
    //camera


//ecs just updates all entities
//ecs may contain ohter stauteses
//camera just helps getting the image

//createGame
//createMenu
//createStatus

createSpawners(Shooter, Bullet, Player, End)

function preload() {
  console.log('preload');
  loadSpriteSheet('tiles', {type: 'pacmanTiles', json: false})
  loadSpriteSheets('player', 'End', 'shooter', 'bullet')
  loadMap('level_0')

  createMenu('mainMenu', MainMenu)
  createMenu('levelSelection', LevelSelection)

  createGame('play', status => {
    status.createGame('pacman', {tileWidth: 16})
    status.camera.settings({ratio: 16 / 9, cameraWidth: 480, cameraMode: 'multiple', cameraOverflow: 'hidden'})
    status.pre = level => setMap(level)
  })
}

function setup() {
  setCurrentStatus('mainMenu')
}

//MainMenu extends menu extends status extends master
//Play extends game extends stauts extends master => parses default, adds spritelayer,
//staushandler extends status extends Master => keeps all statuses or windows open and updates them
//camera extends Master => getSpriteSheet? layers
//entity extends Master => gravity, collision

//ecs = {entities, other?(stauts)}
//ecs.add & ecs.addEntity or instanceof


//animation can be solid?

//on update of ecs on onCollisionEntry add a function parameters => die => set flag they wonna die
//unify onCollisionExit and onCollisionEntry to onCollission

//file directory pattern: app\testing, !libraries

//create class spawner, set some function like spawnrate, spawntype => word, point, area
//remove changeParentName

//fix bullet collision, end collision, push
//StopCollisio add parameter for callback

//getRealY

//x = 100, multiplierX = 2, xOff = 50 => 250
//(250 - xOff) / multiplierX

//x = 250, multiplierX = 3, xOff = 100 => 850
//((850 - xOff) / multiplierX - xOff) / multiplierX


//camera setSize => update graphic
//or with set w => this.graphic.width
//and with set h => this.graphic.height


// TODO: conversions

//!!DELETE CHUNK GRAPCHICS ON DESPAWN!!
//p5.Renderer2D.prototype.rImage
//p5.Renderer2D.prototype.oImage


//Maps

//tile => a
//block => name => 'stone'
//tile(offset = 0, length = 1) => 0 = a, 1 = b, 2 = c, 3 = d
//setTile(a, b, c, d)
//setBlock(name, spritePos?)
