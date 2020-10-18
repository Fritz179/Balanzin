import Keyboard from '/libraries/fritz_4/Keyboard.js'

export default class PlayerController {
  register(listen, player) {
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
