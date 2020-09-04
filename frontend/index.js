const BOARD = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0]
];

class Piece{
  //should consist of 4 cells
  //should have children classes for the different types of pieces
  constructor(color){
    this.cells = this.makeCells();
    this.color = "red";
    // this.color = setRandomColor();
  }

  makeCells(){
    return [new Cell(6,0), new Cell(6,1), new Cell(6,2), new Cell(6,3)];
  }
}

class Cell{
  //should have x and y position properties
  constructor(xPos, yPos){
    this.xPos = xPos;
    this.yPos = yPos;
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const board = document.querySelector('.board');
  displayNewBoard();
  const testPiece = new Piece();
  testPiece.makeCells();
  addPiece(testPiece);

  function displayNewBoard(){
    for (const rowIndex in BOARD){
      const row = document.createElement('tr');
      for (const colIndex in BOARD[rowIndex]){
        const cell = document.createElement('td');
        cell.id = `x${colIndex}y${rowIndex}`
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
  }

  function addPiece(piece){
    // trackPiece(piece);
    // displayPiece(piece);
    for (const cell of piece.cells){
      BOARD[cell.yPos][cell.xPos] = cell;
      displayCell = document.getElementById(`x${cell.xPos}y${cell.yPos}`);
      displayCell.style.backgroundColor = 'blue';
    }
  }

  // function trackPiece(piece){
   
  // }

  // function displayPiece(piece){

  // }
});

