//This file contains a couple of utility functions used through the codebase
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
