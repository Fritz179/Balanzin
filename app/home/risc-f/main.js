import parse from './parse.js'

window.addEventListener('load', () => {
  const input = document.getElementById('source')
  const parseButton = document.getElementById('parse')

  parseButton.onclick = () => {
    const parsed = parse(input.innerHTML)
  }

  const parsed = parse(input.innerHTML)

  console.log(parsed);
})