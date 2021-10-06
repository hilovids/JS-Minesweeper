const gridElement = document.getElementById("grid");
const loseModal = document.getElementById("loseModal");
const winModal = document.getElementById("winModal");
const flagElement = document.getElementById("flags");
const timerElement = document.getElementById("timer");

const length = 18;
const width = 32;
const maxMines = 99;

var numOfFlags = 0;
var numOfMines = 0;

var gameBoard = [];

var spacesRemaining = (length - 2)*(width - 2) - maxMines;

var timer = 0;
var timerInterval;

var colors = ["#b00b13","#3492eb","#34eb5c","#eb4034","#501bb3","#6b0438","#deb46d","#2b2b2b","#858585", "#fc0303"];
//console.log(gameBoard);

window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
  }, false);

// -1 represents a mine
function createArray() {
    for (let i = 0; i < length; i++) {
        gameBoard.push([]);
        for (let j = 0; j < width; j++) {
            // [is mine?, interacted with, display/adjacent mines]
            gameBoard[i][j] = [false, false, 0];
        }
    }
}
createArray();
//console.log(gameBoard);

function populateBoard() {
    while (numOfMines < maxMines) {
        var y = Math.floor(Math.random() * (width - 2)) + 1;
        var x = Math.floor(Math.random() * (length - 2)) + 1;
        if (!gameBoard[x][y][0]) {
            gameBoard[x][y] = [true, false, 0];
            numOfMines++;
            //console.log(gameBoard[x][y][0]);
        }
    }
}
populateBoard();
//console.log(gameBoard);

function countNeighbors() {
    for (let i = 1; i < length - 1; i++) {
        for (let j = 1; j < width - 1; j++) {
            for(let k = -1; k < 2; k++){
                for(let l = -1; l < 2; l++){
                    gameBoard[i][j][2] += gameBoard[i + k][j + l][0];
                }
            }
        }
    }
}
countNeighbors();
//console.log(gameBoard);

function displayBoard(){
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < width; j++) {
            var space = document.createElement("div");
            space.id = j + "," + i;          
            space.classList.add("space");
            space.classList.add("row" + i);
            space.classList.add("col" + j);
            if(i != 0 && j != 0 && i != (length - 1) && j != (width - 1)){
                space.onmousedown = handleClick;

            } else {
                gameBoard[i][j][1] = true;
            }         
            gridElement.appendChild(space);
        }
    }
}
displayBoard();

function handleClick(e){
    if(timerInterval == null){
        timerInterval = setInterval(incrementTimer, 1000);
    }
    var i = parseInt(this.id.split(",")[1]);
    var j = parseInt(this.id.split(",")[0]);
    if(e.button == 2){
        handleRightClick(j,i);
        return;
    }
    console.log(this.id);
    if(gameBoard[i][j][2] == 0){
        deathRowReveal(j,i);
    } else if(gameBoard[i][j][0]){
        this.style.color = colors[9];
        this.innerText = "💣"; 
        loseModal.style.display = "block";
    } else {
        spacesRemaining--;
        this.style.color = colors[gameBoard[i][j][2]];
        this.innerText = gameBoard[i][j][2];
    }
    if(spacesRemaining <= 0) {
        winModal.style.display = "block";
    }
}

function deathRowReveal(x,y){
    spacesRemaining--;
    var element = document.getElementById(x + "," + y);
    gameBoard[y][x][1] = true;
    element.innerText = gameBoard[y][x][2];

    for(let k = -1; k < 2; k++){
        for(let l = -1; l < 2; l++){
            var neighbor = document.getElementById((x+l) + "," + (y+k));
            
            if(!gameBoard[y + k][x + l][1] && gameBoard[y + k][x + l][2] == 0){
                deathRowReveal(x+l,y+k);
            } else if(!gameBoard[y+k][x+l][1]){
                spacesRemaining--;
                neighbor.style.color = colors[gameBoard[y+k][x+l][2]];
                neighbor.innerText = gameBoard[y+k][x+l][2];
                gameBoard[y+k][x+l][1] = true;
            }
        }
    }
}

function resetGame(){
    while (gridElement.firstChild) {
        gridElement.removeChild(gridElement.firstChild);
    }
    numOfMines = 0;
    gameBoard = [];
    numOfFlags = 0;
    timer = 0;
    clearInterval(timerInterval);
    timerInterval = null;
    timerElement.innerText = "000";
    createArray();
    populateBoard();
    countNeighbors();
    displayBoard();
    if(spacesRemaining <= 0){
        winModal.style.display = "none";
    } else {
        loseModal.style.display = "none";
    }
    
}

function handleRightClick(x,y){
    var element = document.getElementById(x + "," + y);
    if(element.innerText == ""){
        element.innerText = "🚩";
        numOfFlags++;
    } else if (element.innerText == "🚩"){
        element.innerText = "";
        numOfFlags--;
    }
    numOfFlags = Math.min(numOfFlags, 999);
    if(numOfFlags < 100){
        flagElement.innerText = "0" + numOfFlags;
    }
    if(numOfFlags < 10){
        flagElement.innerText = "00" + numOfFlags;
    }
}

function incrementTimer(){
    timer++;
    timer = Math.min(timer, 999);
    if(timer < 100){
        timerElement.innerText = "0" + timer;
    }
    if(timer < 10){
        timerElement.innerText = "00" + timer;
    }
}

    