function insertOptions() {
  //insertSlider({tag: 'Speed:', min: 1 ,max: 100 ,step: 1, value: 2, oninput: input => speed = input.value})
  insertSlider('speed: ', 1, 100, 1, 2, input => speed = input.value)
  insertP('Pixels left: ', 'updatePixelsCount')
  insertButton('Restart', restartButtonPressed)
}
