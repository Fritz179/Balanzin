let xOff, yOff, width

function assert(assertion, msg) {
  if (!assertion) {
    alert('Erur :-(\n' + msg)
    debugger
  }
}

function log(...msg) {
  if (fritz.toLog) {
    console.log(...msg);
  }
}

function hasNetFlags(page) {
  return page.netflag && Object.keys(page.netflag).length
}

function getNamedNets(page, netflag) {
  if (!hasNetFlags(page)) {
    return []
  }

  return Object.keys(page.netflag)
    .map(i => page.netflag[i])
    .filter(el => stripName(el.mark.netFlagString) == netflag)
    .sort((a, b) => a.mark.x - b.mark.x)
}

function getNewName(link) {
  if (!link) return ''

  // floor number to get current col/row, 10 = margin, 195 = 1he
  const f = x => Math.ceil((x - 10) / 195)
  // char [0 = A, 1 = B, 2 = C...]
  const c = x => String.fromCharCode(64 + x)

  return `${link.page}.${c(f(link.mark.y - yOff))}/${f(link.mark.x - xOff)}`
}

const linkReg = /\(.*?\)/
function stripName(name) {
  return name.replace(linkReg, '').trim()
}

function rename(net, left, right) {
  const name = stripName(net.mark.netFlagString)

  // get left, right and middle part
  const l = getNewName(left)
      , r = getNewName(right)
      , m = l && r ? ', ' : ((!l && !r) ? '???' : '')

  const newName = `${name} (${l + m + r})`

  if (net.mark.netFlagString != newName) {
    console.log(`renaming: '${net.mark.netFlagString}' to: '${newName}'`);

    net.mark.netFlagString = newName
    api('updateShape', {
      shapeType: "netflag",
      jsonCache: {
        gId: net.configure.gId,
        mark: net.mark
      }
    });
  }

}

function addPageNumber(titleToId, page) {
  const title = getAnn(page.json, 'frame_title').string
  const res = title.match(/curr: ([0-9]*)?,/)
  const num = res ? +res[1] : -1
  page.page = num

  assert(!titleToId[title], '2 pagini cun al stes titul?')
  titleToId[title] = page.tabid

  return page
}

function getAnn(page, c_etype) {
  for (name in page.schlib.frame_lib_1.annotation) {
    const ann = page.schlib.frame_lib_1.annotation[name]

    if (ann.c_etype == c_etype) {
      return ann
    }
  }
}

// api('getAllJson', {type: 'json'}).map(p => getAnn(p.json, 'frame_title').string)

function getJSONS() {
  const titleToId = {}
  // get current and sorted array of pages
  const current = api('getSource', {type:'json'})
  const all = api('getAllJson', {type: 'json'})
    .map(page => addPageNumber(titleToId, page))
    .sort((a, b) => a.page - b.page)

  const currentId = current.head.uuid || titleToId[getAnn(current, 'frame_title').string]
  let currentIndex = -1

  assert(currentId, 'nisün id??')

  // set offsets for col/row maths
  xOff = current.BBox.x
  yOff = current.BBox.y

  for (let i = 0; i < all.length; i++) {
    if (all[i].tabid == currentId) {
      currentIndex = i
      break
    }
  }

  assert(currentIndex != -1, 'Invalid page?')

  // new page
  if (all[currentIndex].page == -1) {
    all[currentIndex].page = all[all.length - 1].page + 1
    all.sort((a, b) => a.page - b.page)
    currentIndex = all.length - 1
  }

  return [all, current, currentIndex]
}

function run() {
  const [all, current, currentIndex] = getJSONS()

  // get new title
  const next = currentIndex + 1 < all.length ? `next: ${all[currentIndex + 1].page}` : `l'ültim`
  const newTitle = `curr: ${all[currentIndex].page}, ${next}`

  // find title annotation, update if different
  const ann = getAnn(current, 'frame_title')
  if (ann.string != newTitle) {

    console.log(`retitling: '${ann.string}' to: '${newTitle}'`);
    ann.string = newTitle

    api('applySource', {source: current, createNew: false});
  }

  // short-circuit if no netflags present
  if (!hasNetFlags(current)) {
    return
  }

  // get all net names to crawl
  const netNames = [...new Set(Object.keys(current.netflag)
    .map(key => stripName(current.netflag[key].mark.netFlagString)))]

  const firstLeft = {}
  const firstRight = {}
  log('to crawl:', netNames);

  netNames.forEach(netName => {
    log('crawling: ', netName);

    // crawl left
    for (let i = currentIndex - 1; i >= 0; i--) {
      const nets = getNamedNets(all[i].json, netName)

      if (nets.length) {
        firstLeft[netName] = nets[0]
        firstLeft[netName].page = all[i].page
        break
      }
    }

    // crawl right
    for (let i = currentIndex + 1; i < all.length; i++) {
      const nets = getNamedNets(all[i].json, netName)

      if (nets.length) {
        firstRight[netName] = nets[nets.length - 1]
        firstRight[netName].page = all[i].page
        break
      }
    }

    // aplly current
    const nets = getNamedNets(current, netName)
    assert(nets.length, 'impusibal')

    if (nets.length == 1) {
      rename(nets[0], firstLeft[netName], firstRight[netName])
    } else {
      rename(nets[0], firstLeft[netName], null)
      rename(nets[nets.length - 1], null, firstRight[netName])
    }
  })

  return 0
}

function start() {
  try {
    run()
    if (!fritz.autoRun) {
      console.warn('fritz.autoRun is false, use run() for single execution');
    }
  } catch (e) {
    fritz.autoRun = false
    console.error(e);
    alert('Erur, fritz.autoRun le disabiltu')
    debugger
  } finally {
    if (fritz.autoRun) {
      setTimeout(start, fritz.delay)
    }
  }
}

// expose functions
const fritz = window.fritz = {
  toLog: true,
  autoRun: true,
  delay: 1000,
  run,
  start,
  api,
  autoStart: () => { autoRun = true; start() }
}

start()

/*
  Page navigation
*/

function changePage(dir) {
  const [all, current, currentIndex] = getJSONS()
  const newPage = currentIndex + dir

  if (newPage < 0 || newPage >= all.length) {
    alert("le l'ultima pagina...")
    return
  }

  const id = all[newPage].tabid
  const el = document.querySelector(`[node-id="${id}"] .tree-title`)

  log(`navigating from:
    [${all[currentIndex].page}, ${all[currentIndex].title}, ${currentIndex}] to:
    [${all[newPage].page}, ${all[newPage].title}, ${newPage}]
  `)

  el.click()
  const e = new MouseEvent('dblclick', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  el.dispatchEvent(e);
}

function keyListener(e) {
  try {
    if (e.altKey) {
      if (e.key == 'ArrowRight') {
        changePage(1)
        e.preventDefault()
      } else if (e.key == 'ArrowLeft') {
        changePage(-1)
        e.preventDefault()
      } else if (e.key == 'ArrowUp') {
        fritz.autoRun = ! fritz.autoRun
        if (fritz.autoRun) fritz.start()

        console.log(`fritz autoRun: ${fritz.autoRun}`);
      }
    }
  } catch (e) {
    alert('erur')
    console.log(e);
  }
}

window.addEventListener('keydown', e => keyListener(e), true)

setInterval(() => {
  document.querySelectorAll('iframe').forEach(el => {
    if (!el.contentWindow.hasFritzListener) {
      el.contentWindow.addEventListener('keydown', e => keyListener(e), true)
      el.contentWindow.hasFritzListener = true
    }
  })
}, 1000)
