const timer = new Timer(60, fixedUpdate, update, false)

const {round, floor, ceil, PI, abs, min, max, sign} = Math
const random = (...args) => {
  if (args.length == 0) {
    return Math.random()
  } else if (args.length == 1) {
    if (Array.isArray(args[0])) {
      return args[0][Math.floor(Math.random() * min.length)]
    } else {
      return Math.random() * args[0]
    }
  } else {
    return Math.random() * (args[1] - args[0]) + args[0]
  }
}

createCrawler('fixedUpdate')
function fixedUpdate() {
  crawl('fixedUpdate')
}

let redrawAll = false
function update() {
  updateMouseHover()
  redrawAll = redrawAll || debugEnabled

  if (masterLayer.update() || masterLayer.changed || redrawAll) {
    masterLayer.render(masterLayer)
    masterLayer.changed = false
    redrawAll = false
    return true
  }
}

function addLayer(child) {
  masterLayer.addChild(child)
}

const entities = {}
function addEntities(...args) {
  args.forEach(entity => {
    entities[entity.name.toLowerCase()] = entity
  })
}
