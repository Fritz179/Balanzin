// load an image an parse image with an encoding type or with a custom function,
// encoding type is specified in the json file (typically located in the same folder with same file name)
// if the mirror key is set to true, the image will be parsed and saved with a left and righ variant
//
// encoding types available:
// animations => varius named animations, usufull for multi-actions entity, mirror available if needed
// pacman => loads in sprites to create a map pacman_like tile based game, block construction

//define global references
const sprites = {}
const parsers = {}

function addParser(name, fun) {
  parsers[name] = fun
}

//load mnore sprites with the default options
function loadSprites(...sprites) {
  sprites.forEach(sprite => {
    loadSprite(sprite)
  })
}

function loadSprite(name, options = {}, callback) {

  if (typeof options == 'function') {
    options = {parser: options, json: !!callback}
  } else if (typeof options == 'string') {
    options = {path: options, parser: callback}
  }

  addDefaultOptions(options, {recursive: false, json: true, ext: 'png'})

  const path = options.path ? `${options.path}/${name}` : name
  const imgPath = options.src || `${path}.${options.ext}`
  const jsonPah = options.jsonSrc || `${path}.json`

  function parse(img, json = false) {
    let parser

    if (options.parser) parser = options.parser
    else if (options.recursive) parser = parsers.recursive
    else if (json.tiles) parser = parsers.tiles
    else if (json.animations) parser = parsers.animation

    if (!parser) {
      let available = Object.keys(parsers).map(type => `\n\t${type}`)
      console.error(`Invalid sprite type: ${options.type}, available: ${available}`);
    }

    const output = parser(img, json, options)

    if (output instanceof Canvas) {
      sprites[name] = output
    } else if (output !== false) {

      // make sure that sprite is an array
      sprites[name] = []
      addDefaultOptions(sprites[name], output)
    }
  }

  if (options.json && !options.recursive) {
    Promise.all([
      _loadImage(imgPath),
      _loadJSON(jsonPah)
    ]).then(([img, json]) => {
      parse(img, json)
    })
  } else {
    _loadImage(imgPath).then(img => {
      parse(img)
    })
  }
};

const tiles = []
let lastTileId = 0

addParser('tiles', (img, json) => {
  const properties = [], _properties = new Map(), defaultProp = {}

  const {width, height} = img
  const {x = 0, y = 0, w = 16, h = 16} = json

  parseGroup(json, defaultProp, {x, y, w, h})

  function parseGroup(group, defaultProp, metadata) {
    if (group.properties) {
      Object.keys(group.properties).forEach(prop => {
        if (typeof group.properties[prop] == 'string' && group.properties[prop][0] == '_') {
          _properties.set(group.properties[prop].slice(1), prop)
        } else {
          properties.push(prop)
          defaultProp[prop] = group.properties[prop]
        }
      })
    }

    const {tiles} = group

    tiles.forEach((tile, i) => {
      if (tile.tiles) {
        parseGroup(tile, Object.assign({}, defaultProp), metadata)
      } else {
        properties.forEach(prop => {
          if (typeof tile[prop] == 'undefined') {
            tile[prop] = defaultProp[prop]
          }
        })

        _properties.forEach((prop, of) => {
          if (typeof tile[prop] == 'undefined') {
            tile[prop] = tile[of]
          }
        })

        let {x, y, w, h} = metadata

        if (tile.x) x = tile.x
        if (tile.y) y = tile.y

        if (x >= width) {
          metadata.x = x = 0
          metadata.y = y = y + h
          if (y >= height) {
            debugger
            throw new Error('outside image boundry!')
          }
        }

        tile.sprite = cut(img, x, y, w, h)
        addTile(tile)

        //go to next tile, move x and y
        metadata.x += w
      }
    })
  }

  function addTile(newTile) {
    const id = lastTileId++

    if (tiles[id]) {
      throw new Error(`Id: ${id}, already in use by: ${tiles[id].name}, duplicate: ${name}`)
    }

    const tile = { }

    properties.forEach(prop => {
      if (typeof tile[prop] == 'undefined') tile[prop] = newTile[prop]
    })

    _properties.forEach(prop => {
      if (typeof tile[prop] == 'undefined') tile[prop] = newTile[prop]
    })
    if (typeof tile.sprite == 'undefined') tile.sprite = newTile.sprite

    tile.id = id
    tiles[id] = tile
    tiles[newTile.name] = tile
    tile.name = newTile.name
  }

  return false
})

addParser('recursive', (img, json, data) => {
  const sprite = []

  let {recursive, w, h} = data
  let x = 0, y = 0

  if (!h) h = img.height
  if (!w) w = h
  if ((img.width / w) % 0) throw new Error(`Invalid format for recursive img: ${path}`)

  for (let i = 0; i < recursive; i++) {
    const x1 = (i * w) % img.width
    const y1 = (i * w - x1) / img.width

    sprite.push(cut(img, x1, y1, w, h))
  }

  return sprite
})

function parsePacmanTiles(img) {
  const l = 0

  const w = h = img.height

  const sprite = []
  sprite.tilePieces = {
    corner: cut(img, 0, 0, w, h),
    junction: flipH(cut(img, w, 0, w, h)),
    junctionRotated: unRotate(cut(img, w, 0, w, h)),
    straightLeft: cut(img, w * 2, 0, w, h),
    straightRight: unRotate(cut(img, w * 3, 0, w, h)),
    outer: cut(img, w * 4, 0, w, h),
    empty: cut(img, w * 5, 0, w, h),
    converter: {},
    collision: {},
    add: (tile, collision) => {
      if (typeof sprite.tilePieces.converter[tile] == 'undefined') {
        sprite.tilePieces.converter[tile] = sprite.length
        sprite.tilePieces.collision[sprite.length] = collision
        sprite[sprite.length] = compose(tile.split('_'), w, h)
      }
    }
  }

  sprite.tilePieces.add('empty_empty_empty_empty', 0)

  function compose(pieces, w, h) {7
    let g =  createGraphics(w * 2, h * 2)
    g.image(sprite.tilePieces[pieces[0]], 0, 0, w, h)
    g.image(rotate90(sprite.tilePieces[pieces[1]]), w, 0, w, h)
    g.image(rotate90(rotate90(sprite.tilePieces[pieces[2]])), w, h, w, h)
    g.image(unRotate(sprite.tilePieces[pieces[3]]), 0, h, w, h)
    return g
  }

  return sprite
}

addParser('animation', (img, json) => {
  if (!json) {
    return new Canvas(img)
  }

  const sprite = {}
  json.animations.forEach(animation => {
    const {x, y, w, h, xd, yd, action, xOff = 0, yOff = 0, mirror = json.mirror, ultraMirror = json.ultraMirror} = animation
    const off = i => [Array.isArray(xd) ? xd[i] : xd, Array.isArray(yd) ? yd[i] : yd]
    sprite[action] = []

    if (animation.recursive) {
      const wrap = img.width
      sprite[action].mirrored = false

      //once defaults are setted, loop through animation
      for (let i = 0; i < animation.recursive; i++) {
        sprite[action][i] = []
        let x1 = (x + w * i) % wrap
        let y1 = y + h * Math.floor((x + w * i) / wrap)
        if (!Number.isInteger(x1) || !Number.isInteger(y1) || !action) throw new Error(`invalid arguments for ${name} sprite`)

        if (ultraMirror) {
          sprite[action][i][0] = cut(img, x1, y1, w, h, ...off(0))
          sprite[action][i][1] = rotate90(cut(img, x1, y1, w, h, ...off(1)))
          sprite[action][i][2] = rotate90(rotate90(cut(img, x1, y1, w, h, ...off(2))))
          sprite[action][i][3] = unRotate(cut(img, x1, y1, w, h, ...off(3)))
        } else if (mirror) {
          sprite[action][i][0] = cut(img, x1, y1, w, h, ...off(0))
          sprite[action][i][1] = flipH(cut(img, x1, y1, w, h, ...off(1)))
        } else {
          sprite[action][i] = cut(img, x1, y1, w, h, ...off(0))
        }
      }
    } else {
      sprite[action].mirrored = true
      if (ultraMirror) {
        sprite[action][0] = cut(img, x, y, w, h, ...off(0))
        sprite[action][1] = rotate90(cut(img, x, y, w, h, ...off(1)))
        sprite[action][2] = rotate90(rotate90(cut(img, x, y, w, h, ...off(2))))
        sprite[action][3] = unRotate(cut(img, x, y, w, h, ...off(3)))
      } else if (mirror) {
        sprite[action][0] = cut(img, x, y, w, h, ...off(0))
        sprite[action][1] = flipH(cut(img, x, y, w, h, ...off(1)))
      } else {
        sprite[action] = cut(img, x, y, w, h, ...off(0))
      }
    }
  })

  return sprite
})

function cut(img, x, y, w, h, xd = 0, yd = 0) {
  let c = new Canvas(w, h)
  c.noSmooth()
  c.image(img, 0, 0, w, h, x, y, w, h)
  return c.setPos(xd, yd)
}

function rotate90(img) {
  const w = img.width, h = img.height
  let c = new Canvas(h, w)
  c.noSmooth()
  c.rotate(HALF_PI)
  c.image(img, 0, -h, w, h, 0, 0, w, h, {trusted: true})
  if (img.offset) c.offset = img.offset
  return c.setPos(img.x || 0, img.y || 0)
}

function unRotate(img) {
  const w = img.width, h = img.height
  let c = new Canvas(h, w)
  c.noSmooth()
  c.rotate(-HALF_PI)
  c.image(img, -w, 0, w, h, 0, 0, w, h, {trusted: true})
  if (img.offset) c.offset = img.offset
  return c.setPos(img.x || 0, img.y || 0)
}

function flipH(img) {
  const w = img.width, h = img.height
  let c = new Canvas(w, h)
  c.noSmooth()
  c.scale(-1, 1)
  c.image(img, -w, 0, w, h, 0, 0, w, h, {trusted: true})
  if (img.offset) c.offset = img.offset
  return c.setPos(img.x || 0, img.y || 0)
}

function flipV(img) {
  const w = img.width, h = img.height
  let c = new Canvas(w, h)
  c.noSmooth()
  c.scale(1, -1)
  c.image(img, 0, -h, w, h, 0, 0, w, h, {trusted: true})
  if (img.offset) c.offset = img.offset
  return c.setPos(img.x || 0, img.y || 0)
}
