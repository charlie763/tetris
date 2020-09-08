const BASE_URL = "http://localhost:3000/"
const BOARD = [...Array(24).keys()].map(key=>[1,0,0,0,0,0,0,0,0,0,0,1])
BOARD.push([1,1,1,1,1,1,1,1,1,1,1,1]);

class Cell{
  constructor(x, y, piece){
    this.x = x;
    this.y = y;
    this.pieceId = piece.id;
    this.color = piece.color;
  }
}

let pieceId = 1;
class Piece{
  constructor(){
    this.color = Piece.setRandomColor();
    this.id = pieceId;
    pieceId++;
  }

  static random(){
    const PIECE_OPTIONS = [()=> new tPiece(), 
      ()=> new iPiece(), 
      ()=> new lPiece(), 
      ()=> new zPiece(), 
      ()=> new sPiece()
    ];
    return PIECE_OPTIONS[uniqIndex(5)]();
  }

  static setRandomColor(){
    const COLOR_OPTIONS = ["red", "blue", "yellow", "green", "orange"]
    return COLOR_OPTIONS[uniqIndex(5)];
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
    this.cells = this.makeCells();
  }

  makeCells(){ 
    return [new Cell(5,0,this), new Cell(5,1,this), new Cell(5,2,this), new Cell(5,3,this)];
  }
}

class lPiece extends Piece {
  constructor(){
    super();
    this.cells = this.makeCells();
  }

  makeCells(){ 
    const options = [
      [new Cell(5,0,this), new Cell(5,1,this), new Cell(5,2,this), new Cell(6,2,this)],
      [new Cell(6,0,this), new Cell(6,1,this), new Cell(6,2,this), new Cell(5,2,this)]
    ]
    return options[uniqIndex(2)];
  }
}

class tPiece extends Piece {
  constructor(){
    super();
    this.cells = this.makeCells();
  }

  makeCells(){ 
    return [new Cell(4,0,this), new Cell(5,0,this), new Cell(6,0,this), new Cell(5,1,this)];
  }
}

class zPiece extends Piece {
  constructor(){
    super();
    this.cells = this.makeCells();
  }

  makeCells(){
    const options = [
      [new Cell(4,1,this), new Cell(5,1,this), new Cell(5,0,this), new Cell(6,0,this)],
      [new Cell(4,0,this), new Cell(5,1,this), new Cell(5,0,this), new Cell(6,1,this)]
    ]
    return options[uniqIndex(2)];
  }
}

class sPiece extends Piece {
  constructor(){
    super();
    this.cells = this.makeCells();
  }

  makeCells(){
    return [new Cell(5,0,this), new Cell(5,1,this), new Cell(6,0,this), new Cell(6,1,this)];
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  //declare variables
  const board = document.querySelector('.board');
  const loginModal = document.querySelector('.loginModal');
  const pause = document.querySelector('#pause');
  const resume = document.querySelector('#resume');
  const save = document.querySelector('#save');
  const score = document.querySelector('#score');
  const submitUser = document.querySelector('#submitUser');
  let activePiece = Piece.random();
  let loggedIn = false;
  let paused = false;
  let username;
  let savingGame = false;

  //initialize board display
  displayNewBoard();
  addPiece(activePiece);

  //event listeners
  //note: the key down event listener doesn't start until user clicks
  document.addEventListener('keydown', (e)=>handleKeyDown(e));
  pause.addEventListener('click', pauseGame);
  resume.addEventListener('click', resumeGame);
  save.addEventListener('click', ()=>{
    savingGame = true;
    if (loggedIn){
      saveGame();
    } else {
      pauseGame();
      displayLogin();
    }
  });
  submitUser.addEventListener('click', (e)=>loginUser(e));

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

  function loginUser(e){
    e.preventDefault();
    username = document.querySelector('.loginModal input[name="name"]').value;
    const body = {name: username};
    if (savingGame){
      body.last_game = JSON.stringify(BOARD);
      resumeGame();
    }
    userPostRequest(body, true);
    hideLogin();
  }

  function pauseGame(){
    window.clearInterval(movementInterval);
    paused = true;
  }

  function resumeGame(){
    if (paused){
      movement();
      paused = false;
    }
  }

  function saveGame(){
    const body = {
     name: username,
     last_game: JSON.stringify(BOARD)
    }
    userPostRequest(body);
  }

  //display functions  
  function displayLogin(){
    loginModal.style.display = 'block';
  }

  function hideLogin(){
    loginModal.style.display = 'none';
  }

  function displayNewBoard(){
    for (const rowIndex in BOARD){
      const row = document.createElement('tr');
      if (rowIndex<2){
        row.style.display = "none";
      }
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

  function addCell(cell){
    BOARD[cell.y][cell.x] = cell;
    displayCell = document.getElementById(`x${cell.x}y${cell.y}`);
    displayCell.style.backgroundColor = cell.color;
  }

  function addPiece(piece){
    for (const cell of piece.cells){
      addCell(cell);
    }
  }

  function eraseCell(x,y){
    BOARD[y][x] = 0;
    const displayCell = document.getElementById(`x${x}y${y}`);
    displayCell.style.backgroundColor = "transparent";
  }

  function erasePiece(piece){
    for (const cell of piece.cells){
      eraseCell(cell.x,cell.y);
    }
  }

  function eraseRow(rowCoord){
    [...Array(11).keys()].slice(1).forEach((xCoord)=>{
      eraseCell(xCoord,rowCoord)
    });
  }

  function moveCellsDown(cells, rowsDown){
    for (const cell of cells){
      eraseCell(cell.x, cell.y);
      cell.y += rowsDown;
      addCell(cell);
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
  movement(200);
  
  function completeRows(activePiece){
    const yCoords = mapUnique(activePiece.cells, (cell)=>cell.y);
    return yCoords.filter((row)=>BOARD[row].every((cell)=>cell!==0)) 
  }

  function collectCellsAbove(rowCoord){
    return Array.from(Array(rowCoord).keys()).flatMap((row)=>{
      return BOARD[row].filter((cell)=>typeof cell === "object")
    });
  }

  function increaseScore(){
    let scoreNum = parseInt(score.textContent, 10);
    scoreNum += 10;
    score.textContent = scoreNum;
  }

  function movement(interval=500){
    movementInterval = window.setInterval(()=>{
      const endPositions = activePiece.prepMove(0,1)
      erasePiece(activePiece);
      if (activePiece.isValidMove(endPositions)){
        activePiece.moveTo(endPositions);
      } else {
        addPiece(activePiece);
        const completedRows = completeRows(activePiece);
        if (completedRows.length > 0){
          const cellsAbove = collectCellsAbove(Math.min(...completedRows));
          completedRows.forEach((y)=>{
            eraseRow(y);
            increaseScore();
          });
          moveCellsDown(cellsAbove, completedRows.length);
        }
        activePiece = Piece.random();
      }
      addPiece(activePiece);
    }, interval);
  }
  
  //api calls
  function userPostRequest(body, loggingIn=false){
    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    }
    fetch(BASE_URL + 'users', configObj)
      .then(()=>{
        if (loggingIn){
          loggedIn=true
        }
      })
      // .then(resp => resp.json())
      // .then(json => console.log(json))
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

function uniqIndex(max){
  return Math.floor(Math.random()*max);
}