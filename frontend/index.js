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
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

class Piece{
  constructor(){
    this.color = Piece.setRandomColor();
  }

  static random(){
    const PIECE_OPTIONS = [()=> new tPiece(), 
      ()=> new iPiece(), 
      ()=> new lPiece(), 
      ()=> new zPiece(), 
      ()=> new sPiece()
    ];
    return PIECE_OPTIONS[Math.floor(Math.random()*5)]();
  }

  static setRandomColor(){
    const COLOR_OPTIONS = ["red", "blue", "yellow", "green", "orange"]
    return COLOR_OPTIONS[Math.floor(Math.random()*5)];
  }

  prepMove(xChange, yChange){
    return this.cells.map(cell => {
      return {x: cell.x + xChange, y: cell.y + yChange}
    })
  }

  prepRotation(){
    const pivot = this.cells[1];
    function xPivot(cell){
      return pivot.y - cell.y + pivot.x 
    }
    function yPivot(cell){
      return pivot.y - pivot.x + cell.x
    }
    return this.cells.map(cell => {
      return {x: xPivot(cell), y: yPivot(cell)}
    });
  }  

  isValidMove(endPositions){
    return endPositions.every((position)=> BOARD[position['y']][position['x']] === 0);
  }

  moveTo(endPositions){
    for (const i in this.cells){
      this.cells[i].x = endPositions[i].x
      this.cells[i].y = endPositions[i].y
    }
  }
}

class iPiece extends Piece {
  constructor(){
    super();
    this.cells = iPiece.makeCells();
  }

  static makeCells(){ 
    return [new Cell(5,0), new Cell(5,1), new Cell(5,2), new Cell(5,3)];
  }
}

class lPiece extends Piece {
  constructor(){
    super();
    this.cells = lPiece.makeCells();
  }

  static makeCells(){ 
    return [new Cell(5,0), new Cell(5,1), new Cell(5,2), new Cell(6,2)];
  }
}

class tPiece extends Piece {
  constructor(){
    super();
    this.cells = tPiece.makeCells();
  }

  static makeCells(){ 
    return [new Cell(4,0), new Cell(5,0), new Cell(6,0), new Cell(5,1)];
  }
}

class zPiece extends Piece {
  constructor(){
    super();
    this.cells = zPiece.makeCells();
  }

  static makeCells(){
    return [new Cell(4,1), new Cell(5,1), new Cell(5,0), new Cell(6,0)];
  }
}

class sPiece extends Piece {
  constructor(){
    super();
    this.cells = sPiece.makeCells();
  }

  static makeCells(){
    return [new Cell(5,0), new Cell(5,1), new Cell(6,0), new Cell(6,1)];
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  //declare variables
  const board = document.querySelector('.board');
  const pause = document.querySelector('#pause');
  const resume = document.querySelector('#resume');
  let activePiece = Piece.random();
  let paused = false;

  //initialize board display
  displayNewBoard();
  addPiece(activePiece);

  //event listeners
  //note: the key down event listener doesn't start until user clicks
  document.addEventListener('keydown', (e)=>handleKeyDown(e));
  pause.addEventListener('click', pauseGame);
  resume.addEventListener('click', resumeGame);

  //event handlers
  function handleKeyDown(e){
    const keyDownTranslator = {
      ArrowLeft: "left", 
      ArrowRight: "right", 
      ArrowDown: "down", 
      ArrowUp: "rotate"
    };
    if (!paused && Object.keys(keyDownTranslator).includes(e.key)){
      return movePiece(activePiece, keyDownTranslator[e.key]);
    }
  }

  function pauseGame(){
    window.clearInterval(movementInterval);
    paused = true;
  }

  function resumeGame(){
    if (paused){
      startMovement();
      paused = false;
    }
  }

  //display functions  
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
      BOARD[cell.y][cell.x] = cell;
      displayCell = document.getElementById(`x${cell.x}y${cell.y}`);
      displayCell.style.backgroundColor = piece.color;
    }
  }

  function erasePiece(piece){
    for (const cell of piece.cells){
      BOARD[cell.y][cell.x] = 0;
      const displayCell = document.getElementById(`x${cell.x}y${cell.y}`);
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
      case "rotate":
        endPositions = piece.prepRotation()
        break;
    }

    erasePiece(piece);
    if (piece.isValidMove(endPositions)){
      piece.moveTo(endPositions);
    } 
    addPiece(piece);
  }

  //game logic 
  let movementInterval;
  startMovement(200);
  
  function checkRowCompletion(activePiece){
 
    const yCoords = activePiece.cells.map((cell)=>cell.y) 
  }

  function startMovement(interval=500){
    movementInterval = window.setInterval(()=>{
      const endPositions = activePiece.prepMove(0,1)
      erasePiece(activePiece);
      if (activePiece.isValidMove(endPositions)){
        activePiece.moveTo(endPositions);
      } else {
        addPiece(activePiece);
        checkRowCompletion(activePiece);
        activePiece = Piece.random();
      }
      addPiece(activePiece);
    }, interval);
  }
  
});

//utility functions
function mapUnique(ary, callback){
  const newArray = []
  const uniqTracker = {}
  for (const elem of ary){
    mappedElem = callback(elem);
    if (uniqTracker[mappedElem]===undefined){
      uniqTracker[mappedElem] = true;
      newArray.push(mappedElem);
    } 
  }
  return newArray;
}