function insertOptions() {
  insertSlider({tag: 'Speed:', min: 1 ,max: 100 ,step: 1, value: 2, oninput: input => q = input.value})
  insertSlider('speed', 1, 100, 1, 2, input => q = input.value)
  insertSlider('speed', 1, 100, 1, 2, input => q = input.value)
  insertSlider('speed', 1, 100, 1, 2, input => q = input.value)
  
}
