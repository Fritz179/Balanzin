import entity from './entity.js'
import go from './traits/go.js'
import jump from './traits/jump.js'
import {loadSpriteSheet} from './loadImage.js'
import {createAnimation} from './animation.js'



export function createMario() {
  return loadSpriteSheet('mario').then(sprite => {

    var mario = new entity()

    mario.size.set(13, 16)
    mario.addTrait(new go())
    mario.addTrait(new jump())

    const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 6)

    function routeFrame(mario) {
      if (mario.jump.falling) {
        return 'jump'
      }
      if (mario.go.dist > 0) {
        if ((mario.vel.x > 0 && mario.go.dir < 0) || (mario.vel.x < 0 && mario.go.dir > 0)) {
          return 'break'
        }
        return runAnimation(mario.go.dist)
      }
      return 'idle'
    }

    mario.draw = function drawMario(context) {
      sprite.draw(routeFrame(this), context, 0, 0, mario.go.heading)
    }

    return mario
  })
}
