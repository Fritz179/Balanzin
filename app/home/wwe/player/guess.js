const socket = connect('/wwe/player')

const img = document.querySelector('img')
const ul = document.querySelector('#selection')

socket.on('ready', () => {

  //update when new guess is recived from server
  socket.on('new_guess', guess => {
    img.classList.remove("hidden");
    ul.classList.remove("hidden");
    img.src = guess.url
    guess.options.forEach((option, i) => {
      ul.children[i].children[0].innerHTML = option
    })
  })

  socket.emit('get_new_guess')
})

for (let i = 0; i < 3; i++) {
  ul.children[i].children[0].onclick = () => {
    socket.emit('guess', ul.children[i].children[0].innerHTML)
  }
}
