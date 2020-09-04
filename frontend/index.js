//change to something like BOARD = Array(26).map(()=>Array(12));
const BOARD = [
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1]
];

class Cell{
  //should have x and y position properties
  constructor(xPos, yPos){
    this.xPos = xPos;
    this.yPos = yPos;
  }
}

class Piece{
  //should consist of 4 cells
  //should have children classes for the different types of pieces
  constructor(){
    this.color = "red";
    // this.color = setRandomColor();
  }

  prepMove(xChange, yChange){
    return this.cells.map(cell => {
      return {x: cell.xPos + xChange, y: cell.yPos + yChange}
    })
  }

  isValidMove(endPositions){
    return endPositions.every((position)=> BOARD[position['y']][position['x']] === 0);
  }

  moveTo(endPositions){
    for (const i in this.cells){
      this.cells[i].xPos = endPositions[i].x
      this.cells[i].yPos = endPositions[i].y
    }
  }
}

class iPiece extends Piece {
  constructor(){
    super();
    this.cells = iPiece.makeCells();
  }

  static makeCells(){ //change to static method?
    return [new Cell(5,0), new Cell(5,1), new Cell(5,2), new Cell(5,3)];
  }
}

class lPiece extends Piece {
  constructor(){
    super();
    this.cells = lPiece.makeCells();
  }

  static makeCells(){ //change to static method?
    return [new Cell(5,0), new Cell(5,1), new Cell(5,2), new Cell(6,2)];
  }
}

class tPiece extends Piece {
  constructor(){
    super();
    this.cells = tPiece.makeCells();
  }

  static makeCells(){ //change to static method?
    return [new Cell(4,0), new Cell(5,0), new Cell(6,0), new Cell(5,1)];
  }
}

class zPiece extends Piece {
  constructor(){
    super();
    this.cells = zPiece.makeCells();
  }

  static makeCells(){ //change to static method?
    return [new Cell(4,1), new Cell(5,1), new Cell(5,0), new Cell(6,0)];
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const board = document.querySelector('.board');
  displayNewBoard();
  const testPiece = new zPiece();
  addPiece(testPiece);

  function displayNewBoard(){
    for (const rowIndex in BOARD){
      const row = document.createElement('tr');
      for (const colIndex in BOARD[rowIndex]){
        const cell = document.createElement('td');
        cell.id = `x${colIndex}y${rowIndex}`
        if (BOARD[rowIndex][colIndex] === 1){
          cell.style.backgroundColor = "grey";
        }
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
  }

  function addPiece(piece){
    for (const cell of piece.cells){
      BOARD[cell.yPos][cell.xPos] = cell;
      displayCell = document.getElementById(`x${cell.xPos}y${cell.yPos}`);
      displayCell.style.backgroundColor = piece.color;
    }
  }

  function erasePiece(piece){
    for (const cell of piece.cells){
      BOARD[cell.yPos][cell.xPos] = 0;
      const displayCell = document.getElementById(`x${cell.xPos}y${cell.yPos}`);
      displayCell.style.backgroundColor = "transparent";
    }
  }

  function movePiece(piece, direction){
    // make moves more efficient by doing it per cell?
    let endPositions;
    switch(direction){
      case "left":
        endPositions = piece.prepMove(-1,0)
        break;
      case "right":
        endPositions = piece.prepMove(1,0)
        break;
      case "down":
        endPositions = piece.prepMove(0,1)
        break; 
    }

    erasePiece(piece);
    if (piece.isValidMove(endPositions)){
      piece.moveTo(endPositions);
    }
    addPiece(piece);
  }
  
  //note: the key down event listener doesn't start until user clicks
  document.addEventListener('keydown', (e)=>{
    const keyDownTranslator = {
      ArrowLeft: "left", 
      ArrowRight: "right", 
      ArrowDown: "down", 
      ArrowUp: "rotate"
    };
    if (Object.keys(keyDownTranslator).includes(e.key)){
      return movePiece(testPiece, keyDownTranslator[e.key]);
    }
  });
});

