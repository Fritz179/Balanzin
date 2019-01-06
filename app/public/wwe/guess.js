const socket = connect(window.location.href)
const img = document.getElementById('img')
const ul = document.getElementById('ul')

socket.on('ready', () => {
  socket.emit('get_new_guess')
  socket.on('new_guess', guess => {
    img.classList.remove("hidden");
    ul.classList.remove("hidden");
    img.src = guess.url
    guess.options.forEach((option, i) => {
      ul.children[i].innerHTML = option
    })
  })
})

for (let i = 0; i < 3; i++) {
  ul.children[i].onclick = () => {
    socket.emit('guess', ul.children[i].innerHTML)
  }
}
