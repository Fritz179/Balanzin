const pages = []

applySource: ƒ (e)

doCommand: ƒ (e,t)
getActiveJson: ƒ (e)
getActiveProjectAllSchJson: ƒ (e)
getActiveProjectOpenedSchJson: ƒ ()
getActiveProjectSchCompressStr: ƒ (e)
getAllCompressStr: ƒ (e)
getAllJson: ƒ (e,t)
getCompressStr: ƒ (e,t,n)
getJson: ƒ (e)
getProjectAllPrefixNames: ƒ (e)
getProjectAllSchJson: ƒ (e)
getRes: ƒ (e,t)
getSelectedIds: ƒ ()
getShape: ƒ (e)
getSource: ƒ (e)
requestAction: ƒ (e)
updateShape: ƒ (e)

test = api('getAllJson', {type: 'json'})

function update() {
  console.log(count++);

  const s = api('getSource', {type:'json'})

  for (n in s.netflag) {
    const net = s.netflag[n]

    net.mark.netFlagString = `Net: ${n}, ${count}`

    api('updateShape', {
     	shapeType: "netflag",
    	jsonCache: {
      	gId: n,
        mark: net.mark
      }
    });
  }
}

console.log(document);
document.querySelector('[c_etype="frame_sheet"]').children[0].innerHTML = 'mmm'
const json = api('getSource', {type:'json'})
for (a in json.schlib.frame_lib_1.annotation) {
  const g = json.schlib.frame_lib_1.annotation[a]

  if (g.c_etype == 'frame_sheet') {
    console.log(a, g);
    // g.string = 'asdfsadfasdfasdfas'

    api('updateShape', {
     	shapeType: "schlib",
    	jsonCache: {
      	gId: 'gge63',
        string: 'asdf'
      }
    });
  }
}

function getDoc() {
  return window.top.document.querySelectorAll('.editframe').filter(el => el.parentElement.style.display != 'none')[0].contentWindow.document
}
console.log(document.querySelector('[c_etype="frame_sheet"]'));
function run() {
  // c_etype
  getDoc().querySelectorAll('[c_etype="frame_sheet"]')
  const current = document.querySelector('[c_etype="frame_sheet"]').children[0]

  if (current.innerHTML == '1/1') {
    const totalPages = pages.length

    for (page of pages) {
      page.
    }
  } else {

  }
}

window.addEventListener("keydown", e => {
  if (e.altKey && e.ctrlKey) {
    switch (e.key) {
      case 'f': run(); break;
      case 'd': run = () => {} ; break;
    }
  }
});

function deviate() {
  const current = api('getSource', {type:'json'})

  for (name in current.schlib.frame_lib_1.annotation) {
    const ann = current.schlib.frame_lib_1.annotation[name]

    if (ann.c_etype == 'frame_title') {
      ann.string = 'sdasaddfsafsadfds'
    }
  }

  api('applySource', {source: current, createNew: false});
}
deviate()

/*

  TEST FOR PAGE NAVIGATION

*/
function assert(assertion, msg) {
  if (!assertion) {
    alert('Erur :-(\n' + msg)
    debugger
  }
}

function getAnn(page, c_etype) {
  for (name in page.schlib.frame_lib_1.annotation) {
    const ann = page.schlib.frame_lib_1.annotation[name]

    if (ann.c_etype == c_etype) {
      return ann
    }
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

function log(...msg) {
  if (fritz.toLog) {
    console.log(...msg);
  }
}

window.addEventListener('keydown', (e) => {
  try {
    if (e.altKey) {
      if (e.key == 'ArrowRight') {
        changePage(1)
      } else if (e.key == 'ArrowLeft') {
        changePage(-1)
      }
    }
  } catch (e) {
    alert('erur')
    console.error(e);
  }

  e.preventDefault()
})

fritz.toLog = false
api = fritz.api
