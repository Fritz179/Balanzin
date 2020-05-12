const board = []
let done = false

document.getElementById('button').onclick = () => {
  elements.forEach(el => el.classList = [])
  board.splice(0, 9)
  display()
  done = false
}
const elements = [...document.getElementsByClassName('gameboard')[0].children]

function display() {
  elements.forEach((el, i) => {
    el.innerHTML = board[i] ? board[i] == 1 ? 'x' : 'o' : ''
  })
}

elements.forEach((el, i) => {
  el.addEventListener('click', () => {
    if (done) {
      return
    }

    if (!board[i]) {
      board[i] = 1

      if (board[4]) {
        const [_, pos] = miniMax(board, -1)
        board[pos] = -1
      } else {
        board[4] = -1
      }

      const score = getScore(board)
      if (score) {
        done = true
        if (score == 2) {
          elements.forEach(el => el.classList.add('draw'))
        } else {
          getScore(board, true).forEach(pos => elements[pos].classList.add(score == 1 ? 'won' : 'lost'))
        }
      }

      display()
    }
  })
})

function miniMax(board, turn) {
  let score = getScore(board)
  if (score) {
    return [score]
  }

  let move
  let best = -turn

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = [...board]
      newBoard[i] = turn

      const [score] = miniMax(newBoard, -turn)

      if (best == -turn) {
        best = score
        move = i
      } else if (score == turn) {
        best = score
        move = i
      }
    }
  }

  return [best, move]
}

function getScore(board, pos = false) {
  for (let i = 0; i < 3; i++) {
    if (board[i] && board[i] == board[i + 3] && board[i] == board[i + 6]) return pos ? [i, i + 3, i + 6] : board[i]
    if (board[i * 3] && board[i * 3] == board[i * 3 + 1] && board[i * 3] == board[i * 3 + 2]) return pos ? [i * 3, i * 3 + 1, i * 3 + 2] : board[i * 3]
  }

  if (board[0] && board[0] == board[4] && board[0] == board[8]) return pos ? [0, 4, 8] : board[4]
  if (board[2] && board[2] == board[4] && board[2] == board[6]) return pos ? [2, 4, 6] : board[4]

  for (let i = 0; i < 9; i++) {
    if (!board[i]) return
  }

  return 2
}
