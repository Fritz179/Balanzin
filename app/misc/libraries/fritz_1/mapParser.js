p5.prototype.flags = {
  collideTop: 0x1,
  collideRight: 0x2,
  collideBottom: 0x4,
  collideLeft: 0x8
}
// p5.prototype.mapsSaved = {}
const originalMapJson = {}

//encoding types available:
//pacman => loads in sprites to create a map pacman-like tile based game, block construction

p5.prototype.loadMap = (name, options = {}, callback) => {
  addDefaultOptions(options, {path: '/levels'})

  if (originalMapJson[name] && typeof callback == 'function') callback(originalMapJson[name])
  else {
    //load map and save it
    loadJSON(options.src || `.${options.path}/${name}.json`, json => {
      addDefaultOptions(json, {name})
      originalMapJson[name] = json

      if (typeof callback == 'function') callback(json)
    }, e => {
      console.log(e);
      throw new Error(`Error loading json: ${name} at: `)
    })
  }
}

// p5.prototype.saveCurrentMap = name => {
//   p5.prototype.saveMap(name, p5.prototype.maps)
// }
//
// p5.prototype.saveMap = (name, maps) => {
//   if (!name) throw new Error(`Name non specified for: \n`, maps)
//   if (p5.prototype.mapsSaved[name]) console.warn(`overwriting map: ${name}`);
//   p5.prototype.mapsSaved[name] = maps
// }


function parseMap(json, type) {
  addDefaultOptions(json, {toSpawn: {}})
  const maps = {}
  const tileMap = json.tileMap || initialMapParse(json)
  const w = maps.w = (tileMap.w || json.w), h = maps.h = (tileMap.h || json.h)

  if (type == 'pacman') {
    maps.nameToID = {innerTile: 0, wallTile: 1, outerTile: 2}
    maps.IDToName = ['innerTile', 'wallTile', 'outerTile']
    maps.tileMap = parsePacmanTileMap(tileMap)
    maps.graphicalMap = parsePacmanGraphicalMap(tileMap)
  } else {
    throw new Error(`Invalid maps type: ${type}`)
  }

  if (json.s) maps.s = json.s
  maps.name = json.name
  maps.toSpawn = json.toSpawn
  console.log(maps);
  return maps
}

function initialMapParse(json) {
  addDefaultOptions(json, {shapes: {}})
  const tileMap = []

  const {w, h} = getMapSize(json, 1)
  tileMap.w = w, tileMap.h = h

  fillShapes(tileMap, json)

  return tileMap
}

function getMapSize(json, border = 1) {
  let ws = 99, hs = 99, we = 0, he = 0 //s = start, e = end
  for (let shape in json.shapes) {
    for (let fill in json.shapes[shape]) {
      json.shapes[shape][fill].forEach(points => {
        let x1, y1, x2, y2
        if (shape == 'rect') [x1, y1, x2, y2] = points
        else if (shape == 'point') [x1, y1] = [x2, y2] = points
        else throw new Error(`Invalid shape, ${shape} is not a shape`)
        ws = x1 < ws ? x1 : ws
        hs = y1 < hs ? y1 : hs
        we = x2 > we ? x2 : we
        he = y2 > he ? y2 : he
      })
    }
  }

  // set map size
  if (ws != border || hs != border) throw new Error(`invalid map, nullpunkt invalid, ${ws}${hs}`)

  const w = we + border * 2, h = he + border * 2
  return {w: w, h: h}
}

function fillShapes(tileMap, json) {
  for (let shape in json.shapes) {
    for (let fill in json.shapes[shape]) {
      const toFill = parseInt(fill)
      if (!Number.isInteger(toFill)) throw new Error(`Invalis fill: ${fill}`)
      json.shapes[shape][fill].forEach(points => {
        let x1, y1, x2, y2
        if (shape == 'rect') [x1, y1, x2, y2] = points
        else if (shape == 'point') [x1, y1] = [x2, y2] = points
        else throw new Error(`Invalid shape, ${shape} is not a shape`)
        for (let x = x1; x <= x2; x++) {
          for (let y = y1; y <= y2; y++) {
            tileMap[y * tileMap.w + x] = toFill
          }
        }
      })
    }
  }
}

function parsePacmanTileMap(tileMap) {
  const {w, h} = tileMap, innerTile = 0, wallTile = 1, outerTile = 2
  //loop through current map and set border as wallTile
  fillOffsets(tileMap, [-w - 1, -w, -w + 1, -1, 1, w - 1, w, w + 1], innerTile, wallTile)
  //loop through map and set everithing else as outerTile
  setUndefined(tileMap, w * h, outerTile)
  return tileMap
}

function fillOffsets(tileMap, offsets, toCheck, replace) {
  const j = tileMap.w * tileMap.h
  tileMap.forEach((tile, i) => {
    if (tile == toCheck) {
      offsets.forEach(offset => {
        if (typeof tileMap[i + offset] == 'undefined' && i + offset <= j && i + offset >= 0) {
          tileMap[i + offset] = replace
        }
      })
    }
  })
}

function setUndefined(tileMap, j, tile) {
  for (let i = 0; i < j; i++) {
    if (typeof tileMap[i] == 'undefined') {
      tileMap[i] = tile
    }
  }
}

function parsePacmanGraphicalMap(tileMap) {
  const graphicalMap = []
  tileMap.forEach((tile, i) => {
    graphicalMap[i] = getGraphicalPacmanTile(tileMap, i)
  })
  return graphicalMap
}

function getGraphicalPacmanTile(tileMap, i) {
  const {w} = tileMap, tile = tileMap[i], wallTile = 1, outerTile = 2, graphicalMap = []
  if (tile == wallTile) {
    const l = i % w == 0
    const r = i % w == w - 1
    const offsets = [l ? 0 : -w - 1, -w, r ? 0 : -w + 1, l ? 0 : -1, r ? 0 : 1, l ? 0 : w - 1, w, r ? 0 : w + 1].map(offset => {
      return (typeof tileMap[i + offset] != 'undefined' && offset != 0) ? tileMap[i + offset] : outerTile
    })
    return p5.prototype.sprites.tiles.tilePieces.converter[getPacmanGraphicalString(...offsets)]
  } else {
    return 0
  }
}

function getPacmanGraphicalString(tl, t, tr, l, r, bl, b, br) {
  let tile = []

  getCorner(tl, t, tr, l, r, bl, b, br, 0)

  function getCorner(tl, t, tr, l, r, bl, b, br, depth) {
    if (depth > 3) {
      return
    }

    if (t == 0) {
      if (l == 0) {
        tile.push('corner')
      } else if (r == 0) {
        tile.push('junction')
      } else {
        tile.push('straightLeft')
      }
    } else {
      if (l == 0) {
        if (b == 0) {
          tile.push('junctionRotated')
        } else {
          tile.push('straightRight')
        }
      } else {
        if (tl == 0) {
          tile.push('outer')
        } else {
          tile.push('empty')
        }
      }
    }
    getCorner(tr, r, br, t, b, tl, l, bl, depth + 1)
  }

  let collision = 0
  const {collideTop, collideRight, collideBottom, collideLeft} = p5.prototype.flags
  if (t == 0) collision += collideTop
  if (l == 0) collision += collideLeft
  if (r == 0) collision += collideRight
  if (b == 0) collision += collideBottom

  tile = tile.join('_')
  p5.prototype.sprites.tiles.tilePieces.add(tile, collision)

  return tile
}
