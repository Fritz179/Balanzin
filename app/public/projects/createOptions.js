const options = {}

function preload() {
  options.div = document.getElementById('options')

  addEvent(document)
  if (window.parent != window) { //iframe
    window.parent.window.onresize()
    addEvent(window.parent.document)
  }

  insertTitle('Options:')
  // if (typeof insertOptions == 'function') { // insertOption if exist
  //   insertOptions()
  // } else {
  //   console.log('al manca al insertOptions() :-(');
  // }
  typeof insertOptions == 'function' ? insertOptions() : console.log('al manca al insertOptions() :-(');
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  if (typeof onresize == 'function') { // insertOption if exist
    onresize()
  }
}

function addEvent(doc) {
  doc.addEventListener('keydown', e => {
    keyDown(e)
  }, false);
}

function keyDown(e) {
  var nav = document.getElementById("sidenav")

  if (e.key == 'f') { //fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  } else if (e.key == 'Alt') {  //options
    e.preventDefault() //doesn't focus the options menu of chrome
    if (this.isOpen) {
      this.isOpen = false
      nav.style.width = "0";
    } else {
      this.isOpen = true
      nav.style.width = "300px";
    }
  }
}

// --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- //

function insertButton(value = 'button', callback) {
  const div = Li()
  div.classList.add("button");
  const button = Button(value)
  button.onclick = callback
  div.appendChild(button)

  options.div.appendChild(div)
}

function insertP(value = '', callbackName) {
  const div = Li()
  div.classList.add("p");
  const p = P(value)
  options[callbackName] = input => p.innerHTML = value + input
  div.appendChild(p)

  options.div.appendChild(div)
}

function insertTitle(title = 'Options:') {
  const div = Li()
  div.classList.add("title");
  const h1 = H1(title)
  div.appendChild(h1)
  options.title = h1
  options.div.appendChild(div)
}

function changeTitle(title = 'Options:') {
  options.title.innerHTML = title
}

function insertSlider(tag, min, max, step, value, oninput) {
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

function test(...values) {
  let valid = values.every(val => typeof val != 'undefined')

  if (valid) {
    return true
  } else {
    throw new Error('Invalid arguments')
  }
}

// --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- //

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
