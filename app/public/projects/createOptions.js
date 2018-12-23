const Options = window.parent.document.getElementById('options')

window.onload = () => {

  if (typeof insertOptions == 'function') {
    insertOptions()
  } else {
    console.log('nientUpzion() :-(');
  }
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

  Options.appendChild(div)
}

function lol() {
  console.log('lol');
}

function test(...values) {
  let valid = values.every(val => typeof val != 'undefined')

  if (valid) {
    return true
  } else {
    throw new Error('Invalid arguments')
  }
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
  return document.createElement('li')
}

function Hr() {
  return document.createElement('hr')
}

function P(txt) {
  const p = document.createElement('p')
  p.innerHTML = txt
  return p
}

function Label(txt = 'Placeholder') {
  const label = document.createElement('label')
  label.innerHTML = txt
  return label
}