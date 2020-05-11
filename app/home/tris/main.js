const board = []

document.getElementById('button').onclick = () => {
  board.splice(0, 9)
  display()
}
const elements = [...document.getElementsByClassName('gameboard')[0].children]
let myTurn = true

function display() {
  elements.forEach((el, i) => {
    el.innerHTML = board[i] ? board[i] == 1 ? 'x' : 'o' : ''
  })
}

elements.forEach((el, i) => {
  el.addEventListener('click', () => {
    if (myTurn && !board[i]) {
      board[i] = 1
      doBestMove()
      display()
    }
  })
})

function doBestMove() {
  const [score, i] = miniMax(board, -1)
  board[i] = -1
  console.log(i);
}

function miniMax(board, turn) {
  let draw = -1
  // console.log(board, turn);
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = [...board]
      newBoard[i] = turn

      let score = getScore(newBoard)
      if (score && score != -turn) {
        return [score, i]
      } else if (!score && draw == -1) {
        draw = i
      };

      [score, newI] = miniMax(newBoard, -turn)
      if (score == turn) {
        return [score, i]
      } else if (score == -turn) {
        continue;
      } else {
        draw = i
      }
    }
  }

  return [0, draw]
}

function getScore(board) {
  for (let i = 0; i < 3; i++) {
    if (board[i] && board[i] == board[i + 3] && board[i] == board[i + 6]) return board[i]
    if (board[i * 3] && board[i * 3] == board[i * 3 + 1] && board[i * 3] == board[i * 3 + 2]) return board[i * 3]
  }

  if (board[0] && board[0] == board[4] && board[0] == board[8]) return board[4]
  if (board[2] && board[2] == board[4] && board[2] == board[6]) return board[4]

  for (let i = 0; i < 9; i++) {
    if (!board[i]) return
  }

  return 2
}
