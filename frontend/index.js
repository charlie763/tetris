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

document.addEventListener('DOMContentLoaded', () => {
  // declare variables
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
    loginRequest.then(resp => resp.json())
      .then(userJson => {
        user = userJson
        loggedIn = true
      })
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
