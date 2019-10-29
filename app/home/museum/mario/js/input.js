import keyboard from './keyboardState.js'

export function setupKeyboard(entity, level) {

  var input = new keyboard()

  input.addMapping('Space', keyState => {
    if(keyState) {
      entity.jump.start()
    } else {
      entity.jump.cancel()
    }
  })

  input.addMapping('ArrowRight', keyState => {
    if (keyState == 1) {
      entity.go.dir = keyState
    } else if (entity.go.dir != -1) {
      entity.go.dir = 0
    }
  })
  input.addMapping('KeyD', keyState => {
    entity.go.dir += keyState ? 1 : -1
  })

  input.addMapping('ArrowLeft', keyState => {
    if (keyState == 1) {
      entity.go.dir = -keyState
    } else if (entity.go.dir != 1) {
      entity.go.dir = 0
    }
  })
  input.addMapping('KeyA', keyState => {
    entity.go.dir += keyState ? -1 : 1
  })

  input.addMapping('ShiftLeft', keyState => {
    entity.go.dragFactor = keyState ? 1/5000 : 1/1000
  })

  input.addMapping('KeyC', keyState => {
    if (keyState == 1) {
      level.debugModeEnabled = level.debugModeEnabled == 1 ? 0 : 1
    }
  })

  return input
}
