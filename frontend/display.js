//This file contains functions which handle most of the display logic for the DOM. These functions often
//get called by game logic.
function displayLogin () {
  hideInstructions()
  const loginModal = document.querySelector('#login')
  loginModal.style.display = 'block'
}

function hideLogin () {
  const loginModal = document.querySelector('#login')
  loginModal.style.display = 'none'
}

function displayCell (cell) {
  const dCell = document.getElementById(`x${cell.x}y${cell.y}`)
  dCell.style.backgroundColor = cell.color
}

function unDisplayCell (x, y) {
  const dCell = document.getElementById(`x${x}y${y}`)
  dCell.style.backgroundColor = 'transparent'
}

function displayEndGame () {
  const endGameModal = document.querySelector('#end-game')
  endGameModal.style.display = 'block'
  endGameModal.innerHTML = '<h1>GAME OVER</h1>'
  return endGameModal
}

function unDisplayEndGame () {
  const endGameModal = document.querySelector('#end-game')
  endGameModal.style.display = 'none'
}

function displayHighScore (endGameModal) {
  endGameModal.innerHTML = `
    <h1>GAME OVER</h1>
    <h2>You have a High Score: ${score.textContent}!</h2>
  `
  if (!loggedIn) {
    endGameModal.innerHTML += '<h4>Login to post score to the Leader Board<h4>'
  }
}

function displayInstructions () {
  hideLogin()
  const instructionsModal = document.querySelector('#instructions')
  if (instructionsModal.style.display === '') {
    instructionsModal.style.display = 'block'
  } else {
    instructionsModal.style.display = ''
  }
}

function hideInstructions () {
  const instructionsModal = document.querySelector('#instructions')
  instructionsModal.style.display = ''
}

function displayLeaders (games) {
  const leaderBoard = document.querySelector('#leaderboard')
  leaderBoard.innerHTML = '<h2>High Scores</h2>'
  const leaderList = document.createElement('ul')
  leaderBoard.appendChild(leaderList)
  for (const game of games) {
    const leaderItem = document.createElement('li')
    leaderItem.textContent = `${game.user.name} - ${game.score}`
    leaderList.appendChild(leaderItem)
  }
  leaderBoard.style.display = 'block'
}

function displayNewBoard () {
  const board = document.querySelector('.board')
  for (const rowIndex in BOARD) {
    const row = document.createElement('tr')
    if (rowIndex < 2) {
      row.style.display = 'none'
    }
    for (const colIndex in BOARD[rowIndex]) {
      const cell = document.createElement('td')
      cell.id = `x${colIndex}y${rowIndex}`
      if (BOARD[rowIndex][colIndex] === 1) {
        cell.style.backgroundColor = 'grey'
      }
      row.appendChild(cell)
    }
    board.appendChild(row)
  }
}

function displaySavedGame (game) {
  score.textContent = game.score
  activePiece = new Piece(true, game.activePiece)
  BOARD = game.board
  for (const rowIndex in BOARD) {
    for (const colIndex in BOARD[rowIndex]) {
      const bCell = BOARD[rowIndex][colIndex]
      if (bCell === 0) {
        unDisplayCell(colIndex, rowIndex)
      } else if (typeof bCell === 'object') {
        displayCell(bCell)
      }
    }
  }
}

function addCell (cell) {
  BOARD[cell.y][cell.x] = cell
  displayCell(cell)
}

function addPiece (piece) {
  for (const cell of piece.cells) {
    addCell(cell)
  }
}

function eraseBoard () {
  for (const rowIndex in BOARD) {
    for (const colIndex in BOARD[rowIndex]) {
      if (BOARD[rowIndex][colIndex] !== 1) {
        unDisplayCell(colIndex, rowIndex)
      }
    }
  }
}

function eraseCell (x, y) {
  BOARD[y][x] = 0
  unDisplayCell(x, y)
}

function erasePiece (piece) {
  for (const cell of piece.cells) {
    eraseCell(cell.x, cell.y)
  }
}

function eraseRow (rowCoord) {
  [...Array(11).keys()].slice(1).forEach((xCoord) => {
    eraseCell(xCoord, rowCoord)
  })
}
