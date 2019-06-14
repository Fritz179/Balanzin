const socket = connect('/wwe/logo')

const img = document.getElementById('img')
const ul = document.getElementById('ul')

socket.on('ready', () => {

  //update when new guess is recived from server
  socket.on('new_guess', guess => {
    img.classList.remove("hidden");
    ul.classList.remove("hidden");
    img.src = guess.url
    guess.options.forEach((option, i) => {
      ul.children[i].innerHTML = option
    })
  })

  socket.emit('get_new_guess')
})

for (let i = 0; i < 3; i++) {
  ul.children[i].onclick = () => {
    socket.emit('guess', ul.children[i].innerHTML)
  }
}
