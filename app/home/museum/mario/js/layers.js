export function createBackgroundLayer(level, sprites) {
  const tiles = level.tiles
  const resolver = level.tileCollider.tiles

  var backgroundBuffer = document.createElement('canvas')
  backgroundBuffer.width = 256 + 16
  backgroundBuffer.height = 240

  const context = backgroundBuffer.getContext('2d')

  let startIndex, endIndex
  function redraw(drawFrom, drawTo) {
    startIndex = drawFrom
    endIndex = drawTo
    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.grid[x]
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.animation.has(tile.name)) {
            sprites.drawAnimation(tile.name, context, x - startIndex, y, level.totalTime)
          } else {
            sprites.drawTile(tile.name, context, x - startIndex, y)
          }
        })
      }
    }
  }

  return function drawBackgroundLayer(context, ) {
    const drawW = resolver.toIndex(camera.size.x)
    const drawFrom = resolver.toIndex(camera.pos.x)
    const drawTo = drawFrom + drawW
    redraw(drawFrom, drawTo)

    context.drawImage(backgroundBuffer, -camera.pos.x % 16, -camera.pos.y)
  }
}

export function createSpriteLayer(entities, width = 64, height = 64) {
  const spriteBuffer = document.createElement('canvas')
  spriteBuffer.width = width
  spriteBuffer.height = height

  const spriteBufferContext = spriteBuffer.getContext('2d')

  return function drawSpriteLayer(context, camera) {
    entities.forEach(entity => {
      spriteBufferContext.clearRect(0, 0, width, height)
      entity.draw(spriteBufferContext)

      context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y)
    })
  }
}

export function createCollisionLayer(level) {

  var resolvedTile = []

  const tileResolver = level.tileCollider.tiles
  const tileSize = tileResolver.tileSize

  const getByIndexOriginal = tileResolver.getByIndex
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTile.push({x, y})
    return getByIndexOriginal.call(tileResolver, x, y)
  }


  return function drawCollision(context, camera) {
    if (level.debugModeEnabled) {
      context.strokeStyle = 'blue'
      resolvedTile.forEach(({x, y}) => {
        context.beginPath()
        context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize)
        context.stroke()
      })
      context.strokeStyle = 'red'
      level.entities.forEach(entity => {
        context.beginPath()
        context.rect(entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y, entity.size.x, entity.size.y)
        context.stroke()
      })

      resolvedTile.length = 0
    }
  }
}

export function createCameraLayer(cameraToDraw) {
  return function drawCameraRect(context, fromCamera) {
    context.strokeStyle = 'purple'
    context.beginPath()
    context.rect(cameraToDraw.pos.x - fromCamera.pos.x, cameraToDraw.pos.y - fromCamera.pos.y, cameraToDraw.size.x, cameraToDraw.size.y)
    context.stroke()
  }
}
