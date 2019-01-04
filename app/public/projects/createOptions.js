function preload() {
  if (window.parent != window) { //iframe
    window.parent.window.onresize()
  }

  if (typeof onload == 'function') {
    onload()
  }
}

const mouseListeners = []

function addMouseListener(listener) {
  mouseListeners.push(listener)
}

function mousePressed() {
  mouseListeners.forEach(listener => {
    listener.mousePressed()
  })
  if (typeof mPressed == 'function') {
    mPressed()
  }
}

function mouseDragged() {
  mouseListeners.forEach(listener => {
    listener.mouseDragged()
  })
  if (typeof mDragged == 'function') {
    mDragged()
  }
}

function mouseReleased() {
  mouseListeners.forEach(listener => {
    listener.mouseReleased()
  })
  if (typeof mReleased == 'function') {
    mReleased()
  }
}

let navIsInserted = false
let toggleFullscreen = true
let nav
let options = {}

function insertNav() {
  navIsInserted = true

  const body = document.getElementsByTagName('body')[0]
  nav = Nb()
  body.appendChild(nav)

  options.div = document.getElementById('options')

  function Nb() {
    const nav = Nav()
    nav.id = 'sidenav'
    nav.innerHTML = `<ul id="options"><li class="btnli"><a href="javascript:void(0)" class="closebtn" onclick="toggleNav()">&times;</a></li></ul>`
    return nav
  }

  insertTitle()

  if (window.parent != window) { //iframe
    window.parent.window.onresize()
    addEvent(window.parent.window.document)
  }
  addEvent(document)

  // --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- //

  window.insertButton = (value = 'button', callback) => {
    const div = Li()
    div.classList.add("button");
    const button = Button(value)
    button.onclick = callback
    div.appendChild(button)

    options.div.appendChild(div)
  }

  window.insertP = (value = '', callbackName) => {
    const div = Li()
    div.classList.add("p");
    const p = P(value)
    options[callbackName] = input => p.innerHTML = value + input
    div.appendChild(p)

    options.div.appendChild(div)
  }

  function insertTitle(title = 'Options:')  {
    const div = Li()
    div.classList.add("title");
    const h1 = H1(title)
    div.appendChild(h1)
    options.title = h1
    options.div.appendChild(div)
  }

  window.changeTitle = (title = 'Options:') => {
    options.title.innerHTML = title
  }

  window.insertSlider = (tag, min, max, step, value, oninput) => {
    if (arguments.length == 1) {
      var {tag, min, max, step, oninput, value} = tag
    }

    test(tag, oninput)

    const div = Li()
    div.classList.add("slider");
    div.appendChild(P(tag))

    const input = Input()
    input.type = 'range'
    input.min = min || 1
    input.max = max || 100
    input.step = step || 1
    input.value = value || min || 1
    div.appendChild(input)

    const label = Label(input.value)
    div.appendChild(label)

    input.oninput = () => {
      label.innerHTML = input.value
      oninput(input)
    }

    options.div.appendChild(div)
  }

  // --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- //

  function test(...values) {
    let valid = values.every(val => typeof val != 'undefined')

    if (valid) {
      return true
    } else {
      throw new Error('Invalid arguments')
    }
  }

  function Nav() {
    return document.createElement('nav')
  }

  function Div() {
    return document.createElement('div')
  }

  function Input() {
    return document.createElement('input')
  }

  function Br() {
    return document.createElement('br')
  }

  function Li() {
    var li = document.createElement('li')
    li.classList.add("li");
    return li
  }

  function Hr() {
    return document.createElement('hr')
  }

  function P(txt) {
    const p = document.createElement('p')
    p.innerHTML = txt
    return p
  }

  function H1(txt) {
    const h1 = document.createElement('h1')
    h1.innerHTML = txt
    return h1
  }

  function Label(txt = 'Placeholder') {
    const label = document.createElement('label')
    label.innerHTML = txt
    return label
  }

  function Button(txt = 'Placeholder') {
    const button = document.createElement('button')
    button.innerHTML = txt
    return button
  }
}

// other api //

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  if (typeof onresize == 'function') { // onresize if exist
    onresize()
  }
}

function addEvent(doc) {
  doc.addEventListener('keydown', e => {
    keyDown(e)
  }, false);
}

function keyDown(e) {
  if (e.key == 'f' && toggleFullscreen) { //fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  } else if (e.key == 'Alt' && navIsInserted) {  //options
    e.preventDefault() //doesn't focus the options menu of chrome
    toggleNav()
  }
}

function toggleNav() {
  var nav = document.getElementById("sidenav")

  if (this.isOpen) {
    this.isOpen = false
    nav.style.width = "0";
  } else {
    this.isOpen = true
    nav.style.width = "300px";
  }
}
