addParser('pacman', img => {
  const w = h = img.height

  sprites.tilePieces = {
    corner: cut(img, 0, 0, w, h),
    junction: flipH(cut(img, w, 0, w, h)),
    junctionRotated: unRotate(cut(img, w, 0, w, h)),
    straightLeft: cut(img, w * 2, 0, w, h),
    straightRight: unRotate(cut(img, w * 3, 0, w, h)),
    outer: cut(img, w * 4, 0, w, h),
    empty: cut(img, w * 5, 0, w, h)
  }

  tiles.addPacmanTile = (tile, collision) => {
    if (!tiles[tile]) {
      const newTile = {
        sprite: compose(tile.split('_'), w, h),
        name: tile,
        collision,
      }

      addTile(newTile)
    }

    return tiles[tile].id
  }

  tiles.addPacmanTile('empty_empty_empty_empty', 0)
  tiles[-1] = tiles[0]

  function compose(pieces, w, h) {
    let g = new Canvas(w * 2, h * 2)
    g.image(sprites.tilePieces[pieces[0]], 0, 0, w, h)
    g.image(rotate90(sprites.tilePieces[pieces[1]]), w, 0, w, h)
    g.image(rotate90(rotate90(sprites.tilePieces[pieces[2]])), w, h, w, h)
    g.image(unRotate(sprites.tilePieces[pieces[3]]), 0, h, w, h)
    return g
  }

  return false
})

const validShapes = ['rect', 'point']
function loadLevel(level) {
  const map = {entities: []}

  // init missing shapes array
  validShapes.forEach(shape => {
    if (!level[shape]) level[shape] = []
  })

  const {w, h} = getPacmanMapSize(level)
  map.data = getPacmanMapData(level, w, h)
  map.width = w

  return map
}

function getPacmanMapSize(json, border = 1) {
  let ws = 99, hs = 99, we = 0, he = 0 //s = start, e = end
  validShapes.forEach(shape => {
    json.shapes[shape].forEach(points => {
      let x1, y1, x2, y2
      if (shape == 'rect') [x1, y1, x2, y2] = points
      else if (shape == 'point') [x1, y1] = [x2, y2] = points

      ws = x1 < ws ? x1 : ws
      hs = y1 < hs ? y1 : hs
      we = x2 > we ? x2 : we
      he = y2 > he ? y2 : he
    })
  })

  // set map size
  if (ws != border || hs != border) throw new Error(`invalid map, nullpunkt invalid, ${ws}${hs}`)

  const w = we + border * 2, h = he + border * 2
  return {w: w, h: h}
}

function getPacmanMapData(json, w, h) {
  const len = w * h
  const map = Array(len).fill(-1)

  // fill empty spaces
  validShapes.forEach(shape => {
    json.shapes[shape].forEach(points => {
      let x1, y1, x2, y2
      if (shape == 'rect') [x1, y1, x2, y2] = points
      else if (shape == 'point') [x1, y1] = [x2, y2] = points

      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          map[y * w + x] = 0
        }
      }
    })
  })

  // fill walls
  map.forEach((tile, i) => {
    if (tile == 0) {
      [-w - 1, -w, -w + 1, -1, 1, w - 1, w, w + 1].forEach(offset => {
        if (map[i + offset] == -1) { // tile not specified, still in map size
          map[i + offset] = 1
        }
      })
    }
  });

  // create new sprites if needed
  return map.map((tile, i) => {
    if (tile == 1) {
      const l = i % w == 0
      const r = i % w == w - 1
      const offsets = [l ? 0 : -w - 1, -w, r ? 0 : -w + 1, l ? 0 : -1, r ? 0 : 1, l ? 0 : w - 1, w, r ? 0 : w + 1].map(offset => {
        return map[i + offset] == 0
      })

      return getPacmanTileId(offsets)
    }

    return tile
  })
}

function getPacmanTileId([tl, t, tr, l, r, bl, b, br]) {
  let tile = []

  getCorner(tl, t, tr, l, r, bl, b, br, 0)

  function getCorner(tl, t, tr, l, r, bl, b, br, depth) {
    if (depth > 3) {
      return
    }

    if (t) {
      if (l) {
        tile.push('corner')
      } else if (r) {
        tile.push('junction')
      } else {
        tile.push('straightLeft')
      }
    } else {
      if (l) {
        if (b) {
          tile.push('junctionRotated')
        } else {
          tile.push('straightRight')
        }
      } else {
        if (tl) {
          tile.push('outer')
        } else {
          tile.push('empty')
        }
      }
    }
    getCorner(tr, r, br, t, b, tl, l, bl, depth + 1)
  }

  let collision = 0

  if (t) collision += 1
  if (r) collision += 2
  if (b) collision += 4
  if (l) collision += 8

  return tiles.addPacmanTile(tile.join('_'), collision)
}
