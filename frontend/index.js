//This is the main js file. It handles interaction between different components of the code as well being 
//the main interface for DOM events.
let activePiece
let gameOver = false
let gameStarted = false
let level = 1
let loggedIn = false
let loginRequest
let movementInterval
let movementSpeed = 500
let paused = true
let score
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
  score = document.querySelector('#score')
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
})