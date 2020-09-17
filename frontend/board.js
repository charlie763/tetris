//This file contains basic data structures and classes of the Board: board, cells and pieces
let BOARD = []

function initializeBoard () {
  BOARD = [...Array(24).keys()].map(key => [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
  BOARD.push([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
}

class Cell {
  constructor (x, y, piece) {
    this.x = x
    this.y = y
    this.pieceId = piece.id
    this.color = piece.color
  }
}

let pieceId = 1
class Piece {
  constructor (fromJson = false, json) {
    if (fromJson) {
      this.color = json.color
      this.id = json.id
      this.cells = [
        new Cell(json.cells[0].x, json.cells[0].y, this),
        new Cell(json.cells[1].x, json.cells[1].y, this),
        new Cell(json.cells[2].x, json.cells[2].y, this),
        new Cell(json.cells[3].x, json.cells[3].y, this)
      ]
    } else {
      this.color = Piece.setRandomColor()
      this.id = pieceId
      pieceId++
    }
  }

  static random () {
    const PIECE_OPTIONS = [() => new TPiece(),
      () => new IPiece(),
      () => new LPiece(),
      () => new ZPiece(),
      () => new SPiece()
    ]
    return PIECE_OPTIONS[randomIndex(5)]()
  }

  static setRandomColor () {
    const COLOR_OPTIONS = ['red', 'blue', 'yellow', 'green', 'orange']
    return COLOR_OPTIONS[randomIndex(5)]
  }

  prepMove (xChange, yChange) {
    return this.cells.map(cell => {
      return { x: cell.x + xChange, y: cell.y + yChange }
    })
  }

  prepRotation () {
    const pivot = this.cells[1]
    function xPivot (cell) {
      return pivot.y - cell.y + pivot.x
    }
    function yPivot (cell) {
      return pivot.y - pivot.x + cell.x
    }
    return this.cells.map(cell => {
      return { x: xPivot(cell), y: yPivot(cell) }
    })
  }

  isValidMove (endPositions) {
    return endPositions.every((position) => BOARD[position.y][position.x] === 0)
  }

  moveTo (endPositions) {
    for (const i in this.cells) {
      this.cells[i].x = endPositions[i].x
      this.cells[i].y = endPositions[i].y
    }
  }
}

class IPiece extends Piece {
  constructor () {
    super()
    this.cells = this.makeCells()
  }

  makeCells () {
    return [new Cell(5, 0, this), new Cell(5, 1, this), new Cell(5, 2, this), new Cell(5, 3, this)]
  }
}

class LPiece extends Piece {
  constructor () {
    super()
    this.cells = this.makeCells()
  }

  makeCells () {
    const options = [
      [new Cell(5, 0, this), new Cell(5, 1, this), new Cell(5, 2, this), new Cell(6, 2, this)],
      [new Cell(6, 0, this), new Cell(6, 1, this), new Cell(6, 2, this), new Cell(5, 2, this)]
    ]
    return options[randomIndex(2)]
  }
}

class TPiece extends Piece {
  constructor () {
    super()
    this.cells = this.makeCells()
  }

  makeCells () {
    return [new Cell(4, 0, this), new Cell(5, 0, this), new Cell(6, 0, this), new Cell(5, 1, this)]
  }
}

class ZPiece extends Piece {
  constructor () {
    super()
    this.cells = this.makeCells()
  }

  makeCells () {
    const options = [
      [new Cell(4, 1, this), new Cell(5, 1, this), new Cell(5, 0, this), new Cell(6, 0, this)],
      [new Cell(4, 0, this), new Cell(5, 1, this), new Cell(5, 0, this), new Cell(6, 1, this)]
    ]
    return options[randomIndex(2)]
  }
}

class SPiece extends Piece {
  constructor () {
    super()
    this.cells = this.makeCells()
  }

  makeCells () {
    return [new Cell(5, 0, this), new Cell(5, 1, this), new Cell(6, 0, this), new Cell(6, 1, this)]
  }
}