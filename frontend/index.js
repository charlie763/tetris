//change to something like BOARD = Array(26).map(()=>Array(12));
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
  
  move(direction){
    //need to add logic protecting against collisions or maybe have that in event handler
    for (const cell of this.cells){
      switch(direction){
        case "left":
          cell.xPos -= 1;
          break;
        case "right":
          cell.xPos += 1;
          break;
        case "down":
          cell.yPos += 1;
          break; 
      }
    }
  }
}

class lPiece extends Piece {
  constructor(){
    super();
    this.cells = this.makeCells();
  }

  makeCells(){ //change to static method?
    return [new Cell(6,0), new Cell(6,1), new Cell(6,2), new Cell(6,3)];
  }
}


document.addEventListener('DOMContentLoaded', ()=>{
  const board = document.querySelector('.board');
  displayNewBoard();
  const testPiece = new lPiece();
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
    for (const cell of piece.cells){
      BOARD[cell.yPos][cell.xPos] = cell;
      displayCell = document.getElementById(`x${cell.xPos}y${cell.yPos}`);
      displayCell.style.backgroundColor = piece.color;
    }
  }

  function movePiece(piece, direction){
    //logic for catching invalid moves first
    // make moves more efficient by doing it per cell?
    for (const cell of piece.cells){
      BOARD[cell.yPos][cell.xPos] = 0;
      const displayCell = document.getElementById(`x${cell.xPos}y${cell.yPos}`);
      displayCell.style.backgroundColor = "transparent";
    }
    piece.move(direction);
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
    return movePiece(testPiece, keyDownTranslator[e.key]);
  });
});

