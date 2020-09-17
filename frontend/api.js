//This file contains all the functions that generate fetch requests to the backend api
const BASE_URL = 'http://localhost:3000/'

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