import Level from './level.js'
import {createBackgroundLayer, createSpriteLayer} from './layers.js'
import spriteSheet from './spriteSheet.js'
import {createAnimation} from './animation.js'

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image()
    image.addEventListener('load', () => {
      resolve(image)
    })
    image.src = url
  })
}

export function loadJSON(url) {
  return fetch(url)
  .then(r => r.json())
}

function createTiles(level, backgrounds, patterns, offsetX = 0, offsetY = 0) {
  backgrounds.forEach(background => {
    background.ranges.forEach(([x1, xl, y1, yl]) => {
      if (!yl) {
        if (!y1) {
          y1 = xl
          xl = 1
          yl = 1
        } else {
          yl = 1
        }
      }
      let x2 = x1 + xl
      let y2 = y1 + yl
      for (var x = x1; x < x2; x++) {
        for (var y = y1; y < y2; y++) {
          const derivedX = x + offsetX
          const derivedY = y + offsetY
          if (background.pattern) {
            const backgrounds = patterns[background.pattern].tiles
            createTiles(level, backgrounds, patterns, derivedX, derivedY)
          } else {
            //console.log(background)
            level.tiles.set(derivedX, derivedY, {
              name: background.tiles,
              type: background.type,
            })
          }
        }
      }
    })
  })
}

export function loadSpriteSheet(name) {
  return loadJSON(`./sprites/${name}.json`)
    .then(sheetSpec => Promise.all([
      sheetSpec,
      loadImage(sheetSpec.imageURL),
    ]))
    .then(([sheetSpec, image]) => {
    const sprites = new spriteSheet(image, sheetSpec.tileW, sheetSpec.tileH)

    if (sheetSpec.tiles) {
      sheetSpec.tiles.forEach(tileSpec => {
        sprites.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1])
      })
    }
    if (sheetSpec.frames) {
      sheetSpec.frames.forEach(frameSpec => {
        sprites.define(frameSpec.name, ...frameSpec.rect)
      })
    }
    if (sheetSpec.animations) {
      sheetSpec.animations.forEach(animationsSpec => {
        const animation = createAnimation(animationsSpec.frames, animationsSpec.framelength)
        sprites.defineAnimation(animationsSpec.name, animation)
      })
    }
    return sprites
  })
}

export function loadLevel(name) {
  return loadJSON(`./levels/${name}.json`)
  .then(levelSpec => Promise.all([
    levelSpec,
    loadSpriteSheet(levelSpec.spriteSheet)
  ]))
  .then(([l, backgroundSprites]) => {
    const level = new Level()
    createTiles(level, l.backgrounds, l.patterns)

    const backgroundLayer = createBackgroundLayer(level, backgroundSprites)
    level.comp.layers.push(backgroundLayer)
    const spriteLayer = createSpriteLayer(level.entities)
    level.comp.layers.push(spriteLayer)
    return level
  })
}
