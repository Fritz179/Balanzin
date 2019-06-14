// load an image an parse image with an encoding type or with a custom function,
// encoding type is specified in the json file (typically located in the same folder with same file name)
// if the mirror key is set to true, the image will be parsed and saved with a left and righ variant
//
// encoding types available:
// animations => varius named animations, usufull for multi-actions entity, mirror available if needed
// pacman => loads in sprites to create a map pacman_like tile based game, block construction

//define global references
p5.prototype.sprites = {}
p5.prototype.menuSprites = {}

//load mnore sprites with the default options
p5.prototype.loadSpriteSheets = (...sprites) => {
  sprites.forEach(sprite => {
    p5.prototype.loadSpriteSheet(sprite)
  })
}

p5.prototype.loadMenuSprite = async (name, options = {}, callback) => {
  addDefaultOptions(options, {path: './img/menus', json: true, main: true})
  const sprite = p5.prototype.menuSprites[name] = {}

  //load mainImage if necessary, defaults to true
  const [json, main] = await Promise.all([startJSON(name, options), options.main ? startImg(name, options) : false])
  if (main) sprite.main = main

  //parse json
  addDefaultOptions(json, {sprites: [], buttons: [], options: {}})

  //keep reference
  sprite.json = json

  //add sprites
  for (key in json.sprites) {
    const opt = addDefaultOptions(json.sprites[key], {path: './img/menus'})
    loadSpriteSheet(key, opt, img => sprite[key] = img)
  }

}

p5.prototype.loadSpriteSheet = async (name, options = {}, callback) => {
  addDefaultOptions(options, {json: true, type: 'animations'})

  //load img and json if needed
  const [img, json] = await Promise.all([startImg(name, options), startJSON(name, options)])
  const customParser = options.customSpriteSheetParser

  //if it has a customSpriteSheetParser, use it to parse the sprite
  const sprite = typeof customParser == 'function' ? customParser(img, josn) : parseSpriteSheet(img, json, options)

  //if a callback is supplied, call it
  callback ? callback(sprite) : p5.prototype.sprites[name] = sprite
};

//helper function to load img
function startImg(name, options) {
  addDefaultOptions(options, {path: './img/sprites', format: 'png'})
  return new Promise(resolve => {
    loadImage(options.src || `${options.path}/${name}.${options.format}`, img => {
      //load img
      resolve(img)
    }, (e) => {
      //if image failed to load, throw an error
      console.log(e);
      throw new Error(`Error loading image at: ${e.path[0].src}`);
    })
  });
}

//helper function to load JSON
function startJSON(name, options) {
  //if no json is needed, return
  if (!options.json) return false

  return new Promise(resolve => {
    loadJSON(options.jsonPath || `${options.path}/${name}.json`, json => {
      //get json and return it
      resolve(json)
    }, e => {
      console.log(e);
      throw new Error(`Error json loading: ${name} at: `)
    })
  })
}

function parseSpriteSheet(img, json, options) {
  if (options.type == 'pacmanTiles') return parsePacmanTiles(img)
  else if (options.type == 'tiles') return parseNormalTiles(img, json)
  else if (options.type == 'animations') {
    if (!json) return img
    if (!json.animations) throw new Error(`No animation key on json of:\n ${json}, options:\n ${options}`)
    return parseAnimation(img, json)
  }

  console.error('Cannot parse: ', img, json, options);
}

function parseNormalTiles(img, json) {
  let {x, y, w, h, tiles} = json
  const {width, height} = img
  const sprite = []

  tiles.forEach((tile, i) => {
    sprite[i] = cut(img, x, y, w, h)

    //go to next tile, move x and y
    x += w
    if (x >= width) {
      x = 0
      y += h
      if (y >= height) throw new Error('outside image boundry!')
    }
  })

  return sprite
}

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

function parseAnimation(img, json) {
  const sprite = {}
  json.animations.forEach(animation => {
    const {x, y, w, h, xd, yd, action, xOff = 0, yOff = 0, mirror = json.mirror, ultraMirror = json.ultraMirror} = animation
    sprite[action] = []

    if (animation.recursive) {
      const wrap = img.width

      //once defaults are setted, loop through animation
      for (let i = 0; i < animation.recursive; i++) {
        sprite[action][i] = []
        let x1 = (x + w * i) % wrap
        let y1 = y + h * Math.floor((x + w * i) / wrap)
        if (!Number.isInteger(x1) || !Number.isInteger(y1) || !action) throw new Error(`invalid arguments for ${name} sprite`)
        if (ultraMirror) {
          sprite[action][i][0] = cut(img, x1, y1, w, h, xd, yd)
          sprite[action][i][1] = rotate90(cut(img, x1, y1, w, h, xd, yd))
          sprite[action][i][2] = rotate90(rotate90(cut(img, x1, y1, w, h, xd, yd)))
          sprite[action][i][3] = unRotate(cut(img, x1, y1, w, h, xd, yd))
        } else if (mirror) {
          sprite[action][i][0] = cut(img, x1, y1, w, h, xd, yd)
          sprite[action][i][1] = flipH(cut(img, x1, y1, w, h, xd, yd))
        } else {
          sprite[action][i] = cut(img, x1, y1, w, h, xd, yd)
        }
      }
    } else {
      if (ultraMirror) {
        sprite[action][0] = cut(img, x, y, w, h, xd, yd)
        sprite[action][1] = rotate90(cut(img, x, y, w, h, xd, yd))
        sprite[action][2] = rotate90(rotate90(cut(img, x, y, w, h, xd, yd)))
        sprite[action][3] = unRotate(cut(img, x, y, w, h, xd, yd))
      } else if (mirror) {
        sprite[action][0] = cut(img, x, y, w, h, xd, yd)
        sprite[action][1] = flipH(cut(img, x, y, w, h))
      } else {
        sprite[action] = cut(img, x, y, w, h, xd, yd)
      }
    }
  })

  return sprite
}

function cut(img, x, y, w, h, xd, yd) {
  let g = createGraphics(w, h)
  g.noSmooth()
  g.image(img, 0, 0, w, h, x, y, w, h)
  g.deltaX = xd
  g.deltaY = yd
  return g
}

function rotate90(img) {
  const w = img.width, h = img.height
  let g = createGraphics(h, w)
  g.noSmooth()
  g.rotate(HALF_PI)
  g.image(img, 0, -h, w, h, 0, 0, w, h)
  g.deltaX = img.deltaX
  g.deltaY = img.deltaY
  return g
}

function unRotate(img) {
  const w = img.width, h = img.height
  let g = createGraphics(h, w)
  g.noSmooth()
  g.rotate(-HALF_PI)
  g.image(img, -w, 0, w, h, 0, 0, w, h)
  g.deltaX = img.deltaX
  g.deltaY = img.deltaY
  return g
}

function flipH(img) {
  const w = img.width, h = img.height
  let g = createGraphics(w, h)
  g.noSmooth()
  g.scale(-1, 1)
  g.image(img, -w, 0, w, h, 0, 0, w, h)
  g.deltaX = img.deltaX
  g.deltaY = img.deltaY
  return g
}

function flipV(img) {
  const w = img.width, h = img.height
  let g = createGraphics(w, h)
  g.noSmooth()
  g.scale(1, -1)
  g.image(img, 0, -h, w, h, 0, 0, w, h)
  g.deltaX = img.deltaX
  g.deltaY = img.deltaY
  return g
}
