const BASE_URL = 'http://localhost:3000/'

document.addEventListener('DOMContentLoaded', () => {
  // declare variables
  const board = document.querySelector('.board')
  const instructions = document.querySelector('#instructions-button')
  const load = document.querySelector('#load')
  const loginButton = document.querySelector('#login-button')
  const newGame = document.querySelector('#new-game')
  const pause = document.querySelector('#pause')
  const resume = document.querySelector('#resume')
  const save = document.querySelector('#save')
  const score = document.querySelector('#score')
  const showLeaderBoard = document.querySelector('#show-leaderboard')
  const submitUser = document.querySelector('#submitUser')
  let activePiece
  let gameOver = false
  let gameStarted = false
  let level = 1
  let loggedIn = false
  let loginRequest
  let movementInterval
  let movementSpeed = 500
  let paused = true
  let user

  // initialize board
  initializeBoard()
  displayNewBoard()

  // event listeners
  // note: the key down event listener doesn't start until user clicks
  document.addEventListener('keydown', (e) => handleKeyDown(e))
  instructions.addEventListener('click', displayInstructions)
  load.addEventListener('click', handleLoad)
  loginButton.addEventListener('click', displayLogin)
  newGame.addEventListener('click', () => {
    unDisplayEndGame()
    paused = false
    startNewGame()
  })
  pause.addEventListener('click', pauseGame)
  resume.addEventListener('click', resumeGame)
  save.addEventListener('click', handleSave)
  showLeaderBoard.addEventListener('click', handleLeaders)
  submitUser.addEventListener('click', (e) => loginUser(e))

  // event handlers
  function afterLogin (callback) {
    const interval = window.setInterval(() => {
      if (loginRequest) {
        loginRequest.then(() => {
          callback()
          window.clearInterval(interval)
        })
      }
    }, 1000)
  }

  function handleKeyDown (e) {
    const keyDownTranslator = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowDown: 'down',
      ArrowUp: 'rotate'
    }
    if (!paused && Object.keys(keyDownTranslator).includes(e.key)) {
      return movePiece(activePiece, keyDownTranslator[e.key])
    }
  }

  function handleLeaders () {
    gamesGetRequest().then(resp => resp.json())
      .then(games => displayLeaders(games))
  }

  function handleLoad () {
    if (loggedIn) {
      loadGame()
    } else {
      pauseGame()
      displayLogin()
      afterLogin(loadGame)
    }
  }

  function handleSave () {
    if (loggedIn) {
      saveGame()
    } else {
      pauseGame()
      displayLogin()
      afterLogin(saveGame)
    }
  }

  function loginUser (e) {
    e.preventDefault()
    const username = document.querySelector('#login input[name="name"]').value
    const body = { name: username }
    loginRequest = userPostRequest(body)
    hideLogin()
  }

  function pauseGame () {
    window.clearInterval(movementInterval)
    paused = true
  }

  function resumeGame () {
    if (paused) {
      movement(movementSpeed)
      paused = false
    }
  }

  function loadGame () {
    userGetRequest()
      .then(resp => resp.json())
      .then(json => {
        const game = JSON.parse(json.last_game)
        movementSpeed = game.movementSpeed
        level = game.level
        unDisplayEndGame()
        displaySavedGame(game)
      })
  }

  function saveGame () {
    if (!gameOver) {
      const game = {
        activePiece: activePiece,
        score: parseInt(score.textContent, 10),
        movementSpeed: movementSpeed,
        level: level,
        board: BOARD
      }
      userPatchRequest(JSON.stringify(game))
    }
  }

  // display functions
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

  function moveCellsDown (cells, rowsDown) {
    for (let i = cells.length - 1; i >= 0; i--) {
      eraseCell(cells[i].x, cells[i].y)
      cells[i].y += rowsDown
      addCell(cells[i])
    }
  }

  function movePiece (piece, direction) {
    let endPositions
    switch (direction) {
      case 'left':
        endPositions = piece.prepMove(-1, 0)
        break
      case 'right':
        endPositions = piece.prepMove(1, 0)
        break
      case 'down':
        endPositions = piece.prepMove(0, 1)
        break
      case 'rotate':
        endPositions = piece.prepRotation()
        break
    }

    erasePiece(piece)
    if (piece.isValidMove(endPositions)) {
      piece.moveTo(endPositions)
    }
    addPiece(piece)
  }

  // game logic

  function startNewGame () {
    if (gameStarted) {
      initializeBoard()
      eraseBoard()
      window.clearInterval(movementInterval)
    }
    activePiece = Piece.random()
    addPiece(activePiece)
    score.textContent = 0
    level = 1
    movementSpeed = 500
    movement()
    gameStarted = true
    gameOver = false
    paused = false
  }

  function isHighScore (scoreNum, games) {
    let minHighScore
    if (games.length > 0) {
      minHighScore = Math.min(...games.map(game => game.score))
    } else {
      minHighScore = 0
    }
    return scoreNum > minHighScore
  }

  function completeRows (activePiece) {
    const yCoords = mapUnique(activePiece.cells, (cell) => cell.y)
    const completedRows = yCoords.filter((row) => BOARD[row].every((cell) => cell !== 0))
    return completedRows
  }

  function collectCellsAbove (rowCoord) {
    const cellsAbove = Array.from(Array(rowCoord).keys()).flatMap((row) => {
      return BOARD[row].filter((cell) => typeof cell === 'object')
    })
    return cellsAbove
  }

  function increaseLevel () {
    const scoreNum = parseInt(score.textContent, 10)
    if (scoreNum / level >= 50) {
      level++
    }
    pauseGame()
    movementSpeed = 500 / level
    resumeGame()
  }

  function increaseScore () {
    let scoreNum = parseInt(score.textContent, 10)
    scoreNum += 10
    score.textContent = scoreNum
  }

  function endGame () {
    pauseGame()
    const endGameModal = displayEndGame()
    const scoreNum = parseInt(score.textContent, 10)
    gamesGetRequest()
      .then(resp => resp.json())
      .then(json => {
        if (isHighScore(scoreNum, json)) {
          displayHighScore(endGameModal)
          if (loggedIn) {
            const game = {
              user_id: user.id,
              score: scoreNum
            }
            gamePostRequest(game)
          } else {
            displayLogin()
            afterLogin(() => {
              const game = {
                user_id: user.id,
                score: scoreNum
              }
              gamePostRequest(game)
            })
          }
        }
      })
  }

  function isGameOver () {
    const maxY = Math.max(...activePiece.cells.map((cell) => cell.y))
    return maxY < 2
  }

  function movement () {
    movementInterval = window.setInterval(() => {
      const endPositions = activePiece.prepMove(0, 1)
      erasePiece(activePiece)
      if (activePiece.isValidMove(endPositions)) {
        activePiece.moveTo(endPositions)
      } else {
        addPiece(activePiece)
        const completedRows = completeRows(activePiece)
        if (completedRows.length > 0) {
          const cellsAbove = collectCellsAbove(Math.min(...completedRows))
          completedRows.forEach((y) => {
            eraseRow(y)
            increaseScore()
            increaseLevel()
          })
          moveCellsDown(cellsAbove, completedRows.length)
        }
        if (isGameOver()) {
          endGame()
        }
        activePiece = Piece.random()
      }
      addPiece(activePiece)
    }, movementSpeed)
  }

  // api calls
  function userPostRequest (body) {
    const configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
    return window.fetch(BASE_URL + 'users', configObj)
      .then(resp => resp.json())
      .then(userJson => {
        user = userJson
        loggedIn = true
      })
  }

  function userPatchRequest (game, highScore) {
    const body = {
      name: user.name,
      last_game: game,
      high_score: highScore
    }
    const configObj = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
    return window.fetch(BASE_URL + `users/${user.id}`, configObj)
  }

  function userGetRequest () {
    return window.fetch(BASE_URL + `users/${user.id}`)
  }

  function gamePostRequest (body) {
    const configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
    return window.fetch(BASE_URL + 'completed_games', configObj)
  }

  function gamesGetRequest () {
    return window.fetch(BASE_URL + 'completed_games')
  }
})

// utility functions
function mapUnique (ary, callback) {
  const newArray = []
  const uniqTracker = {}
  for (const elem of ary) {
    const mappedElem = callback(elem)
    if (uniqTracker[mappedElem] === undefined) {
      uniqTracker[mappedElem] = true
      newArray.push(mappedElem)
    }
  }
  return newArray
}

function randomIndex (max) {
  return Math.floor(Math.random() * max)
}
