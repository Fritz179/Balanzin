import {Trait} from '/libraries/fritz_4/Entity.js'
import Keyboard from '/libraries/fritz_4/Keyboard.js'

export default class PlayerController extends Trait {
  init() {
    const player = this.master

    Keyboard.onKeyDown(key => {
      switch (key) {
        case 'a': player.xv -= player.speed; break;
        case 's': player.yv += player.speed; break;
        case 'd': player.xv += player.speed; break;
        case 'w': player.yv -= player.speed; break;
      }
    })

    Keyboard.onKeyUp(key => {
      switch (key) {
        case 'a': player.xv += player.speed; break;
        case 's': player.yv -= player.speed; break;
        case 'd': player.xv -= player.speed; break;
        case 'w': player.yv += player.speed; break;
      }
    })
  }
}
