const links = JSON.parse(localStorage.getItem('links')) || []
const header = document.getElementById('header')
const linksEl = document.getElementById('links')
const custom = document.getElementById('custom')
const page = document.getElementById('page')
const create = document.getElementById('create')

window.onload = () => {
  createLinks()
  custom.onclick = customize

  if (links) {
    clicked(0)
  }
}

window.onresize = onResize
function onResize() {
  page.style.height = `${window.innerHeight - header.clientHeight}px`
}

function createLinks() {
  localStorage.setItem('links', JSON.stringify(links))

  linksEl.innerHTML = ''
  page.innerHTML = ''
  links.forEach((link, i) => {
    const child = createLink(link, i)
    linksEl.appendChild(child)
  })
}

function createLink(link, i) {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('src', `https://www.${link[0]}`)
  iframe.style.display = 'none'
  page.appendChild(iframe)

  const div = document.createElement('div')
  div.innerHTML = `
    <a onclick="clicked(${i})">${link[1]}</a>
  `
  return div
}

function clicked(i) {
  [...page.children].forEach(child => {
    child.style.display = 'none'
  })

  page.children[i].style.display = 'block'

  onResize()
}

function customize() {
  if (create.clientHeight) {
    create.style.display = 'none'
    return
  }

  create.style.display = 'flex'
  createCustom()
}

function createCustom() {
  create.innerHTML = ''

  links.forEach((link, i) => {
    create.appendChild(createCustomizer(link, i))
  })

  create.appendChild(createCustomizer(['', ''], links.length))
}

function createCustomizer(link, i) {
  const div = document.createElement('div')
  div.innerHTML = `
    <label for="name">url:</label>
    <input type="text" class="name" value="${link[0]}" oninput="change(${i}, 0)">
    <label for="url">Nom:</label>
    <input type="text" class="url" value="${link[1]}" oninput="change(${i}, 1)">
    <a onclick="remove('${i}')">cancela</a>
  `

  return div
}

function change(i, j) {
  if (!links[i]) {
    links[i] = ['', '']
    create.appendChild(createCustomizer(['', ''], links.length))
  }

  links[i][j] = event.target.value
  createLinks()
}

function remove(i) {
  links.splice(i, 1)
  createCustom()
  createLinks()
}
