// Written by Dylan Ho 22/06/2016
// Code adapted from: http://codepen.io/solartic/pen/qEGqNL

'use strict';

// Number of ROWS and COLS
const COLS = 9; // ROWS by COLS cells
const ROWS = 9;

// Named-constants of the various dimensions used for graphics drawing
const CELL_SIZE = 50; // cell width and height (square)
const CANVAS_WIDTH = CELL_SIZE * COLS;  // the drawing canvas
const CANVAS_HEIGHT = CELL_SIZE * ROWS;

// Players (circles) are displayed inside a cell, with padding from border
const CIRCLE_RADIUS = 15; // width/height
const CIRCLE_LINEWIDTH = 4; // pen stroke width

// Grid constants
var GRIDLINE_WIDTH = 3;
var GRIDLINE_COLOR = "#ddd";

const WALL_STROKE_WIDTH = 4; // wall stroke width
const WALL_PADDING = 4; // wall padding

// Javascript implementation of Enums. Could possibly use http://www.2ality.com/2016/01/enumify.html
const UDLR = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };
const Direction = { VERTICAL: 'VERTICAL', HORIZONTAL: 'HORIZONTAL'};
const Player = { RED: 'RED', BLU: 'BLU', EMPTY: 'EMPTY'};
const GameStatus = { PLAYING: 'PLAYING', RED_WON: 'RED_WON', BLU_WON: 'BLU_WON'};

/*
const LEFT_NOTATION_WIDTH = 25;
var leftNotation = document.getElementById('left-notation');
var context = leftNotation.getContext('2d');
context.width = LEFT_NOTATION_WIDTH;
context.height = CANVAS_HEIGHT;
context.beginPath();
context.rect(0,0,LEFT_NOTATION_WIDTH,CANVAS_HEIGHT);
context.fillStyle = "black";
context.fill();
//var botNotation = document.getElementById('bot-notation');
*/
var canvasGrid = document.getElementById('quoridor-grid');
canvasGrid.width = CANVAS_WIDTH;
canvasGrid.height = CANVAS_HEIGHT;
var contextGrid = canvasGrid.getContext('2d');

var canvas = document.getElementById('quoridor-pieces');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var context = canvas.getContext('2d');


var gameState = [];

function initGameState() {
    // Player positions
    var redX = 4, redY = ROWS-1;
    var bluX = 4, bluY = 0;

    // Initializing wall positions
    var horizontalWalls = [];
    var verticalWalls = [];
    horizontalWalls.length = COLS-1;
    verticalWalls.length = COLS-1;
    for (var col = 0; col < COLS-1; col++)
    {
        var temporaryWallArrayForHorizontal = [];
        var temporaryWallArrayForVertical = [];
        temporaryWallArrayForHorizontal.length = ROWS-1;
        temporaryWallArrayForVertical.length = ROWS-1;
        for (var row = 0; row < ROWS-1; row++)
        {
            temporaryWallArrayForHorizontal[row] = Player.EMPTY;
            temporaryWallArrayForVertical[row] = Player.EMPTY;
        }
        horizontalWalls[col] = temporaryWallArrayForHorizontal;
        verticalWalls[col] = temporaryWallArrayForVertical;
    }

    // Initializing valid movement coords
    var validMovementsRed = [[3,8],[4,7],[5,8]];
    var validMovementsBlu = [[3,0],[4,1],[5,0]];

    // Initialize current state and current player
    var currentStatus = GameStatus.PLAYING;
    var activePlayer = Player.RED;

    gameState =
    {
        redX : redX,
        redY : redY,
        bluX : bluX,
        bluY : bluY,
        horizontalWalls : horizontalWalls,
        verticalWalls : verticalWalls,
        validMovementsRed : validMovementsRed,
        validMovementsBlu : validMovementsBlu,
        currentStatus : currentStatus,
        activePlayer : activePlayer
    };

    drawO(redX,redY,Player.RED);
    drawO(bluX,bluY,Player.BLU);
}

function drawGridLines () {
    var lineStart = 0;
    var lineLength = CANVAS_WIDTH;
    context.lineWidth = GRIDLINE_WIDTH;
    context.strokeStyle = GRIDLINE_COLOR;
    context.lineCap = 'round';
    context.beginPath();

    // Horizontal lines
    for (var y = 1;y <= ROWS-1;y++) {
        context.moveTo(lineStart, y * CELL_SIZE);
        context.lineTo(lineLength, y * CELL_SIZE);
    }

    // Vertical lines
    for (var x = 1;x <= COLS-1;x++) {
        context.moveTo(x * CELL_SIZE, lineStart);
        context.lineTo(x * CELL_SIZE, lineLength);
    }

    context.stroke();
}

function clickAt (inMousePosition) {
    if (gameState.currentStatus === GameStatus.PLAYING) {
        // Wall placement
        var colSelected = Math.floor(inMousePosition.x / CELL_SIZE);
        var rowSelected = Math.floor(inMousePosition.y / CELL_SIZE);

        var remainderX = inMousePosition.x % CELL_SIZE;
        var remainderY = inMousePosition.y % CELL_SIZE;

        if (remainderY <= WALL_PADDING)
        {
            if (remainderX <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected-1, Direction.HORIZONTAL, currentPlayer);
            else addWall(colSelected, rowSelected-1, Direction.HORIZONTAL, currentPlayer);
        }
        else if (remainderY >= CELL_SIZE - WALL_PADDING)
        {
            if (remainderX <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected, Direction.HORIZONTAL, currentPlayer);
            else addWall(colSelected, rowSelected, Direction.HORIZONTAL, currentPlayer);
        }
        // Check that you're clicking on a vertical wall
        else if (remainderX <= WALL_PADDING)
        {
            if (remainderY <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected-1, Direction.VERTICAL, currentPlayer);
            else addWall(colSelected-1, rowSelected, Direction.VERTICAL, currentPlayer);
        }
        else if (remainderX >= CELL_SIZE - WALL_PADDING)
        {
            if (remainderY <= CELL_SIZE / 2) addWall(colSelected, rowSelected-1, Direction.VERTICAL, currentPlayer);
            else addWall(colSelected, rowSelected, Direction.VERTICAL, currentPlayer);
        }

        // Piece movement
        var validMovements;
        if (gameState.activePlayer === Player.RED) validMovements = gameState.validMovementsRed;
        else validMovements = gameState.validMovementsBlu; // Assume activePlayer !== Player.EMPTY
        for (var i = 0; i < validMovements.length; i++) {
            if (colSelected === validMovements[i][0] && rowSelected === validMovements[i][1]) {
                if (gameState.activePlayer === Player.RED) {
                    // Clear old player token
                    clearPlayingArea(gameState.redX, gameState.redY);

                    // Update coordinates for new player token
                    gameState.redX = colSelected;
                    gameState.redY = rowSelected;

                    // Paint new player token
                    drawO(gameState.redX, gameState.redY, Player.RED);
                }
                else // Assume activePlayer !== Player.EMPTY
                {
                    clearPlayingArea(gameState.bluX, gameState.bluY);

                    gameState.bluX = colSelected;
                    gameState.bluY = rowSelected;

                    drawO(gameState.bluX, gameState.bluY, Player.BLU);
                }

                updateGame();
            }
        }
    }
    else console.log("Why is the game not playing? GameStatus !== GameStatus.PLAYING");
}

function updateGame() {
    // Check if red or blu wins
    if (gameState.redY === 0) gameState.currentStatus = GameStatus.RED_WON;
    else if (gameState.bluY === ROWS-1) gameState.currentStatus = GameStatus.BLU_WON;

    // Swap active player
    if (gameState.activePlayer === Player.RED) gameState.activePlayer = Player.BLU;
    else gameState.activePlayer = Player.RED;

    // Update valid movements
    updateValidMovements();
}

function clearPlayingArea (inX, inY) {
    context.clearRect(
        inX * CELL_SIZE + GRIDLINE_WIDTH,
        inY * CELL_SIZE + GRIDLINE_WIDTH,
        CELL_SIZE - 2 * GRIDLINE_WIDTH,
        CELL_SIZE - 2 * GRIDLINE_WIDTH
    );
}
function drawO (inX, inY, inActivePlayer) {
    var halfSectionSize = CELL_SIZE / 2;
    var centerX = inX * CELL_SIZE + halfSectionSize;
    var centerY = inY * CELL_SIZE + halfSectionSize;
    //var radius = CELL_SIZE / 3;
    var radius = CIRCLE_RADIUS;

    context.lineWidth = CIRCLE_LINEWIDTH;
    if (inActivePlayer === Player.RED) context.strokeStyle = "red";
    else if (inActivePlayer === Player.BLU) context.strokeStyle = "blue";
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();
}
function drawWall (inX, inY, inActivePlayer, inDirection) {
    context.lineWidth = WALL_STROKE_WIDTH;
    if (inActivePlayer === Player.RED) context.strokeStyle = "red";
    else if (inActivePlayer === Player.BLU) context.strokeStyle = "blue";
    context.lineCap = 'butt';
    context.beginPath();

    if (inDirection === Direction.HORIZONTAL)
    {
        var x1 = inX * CELL_SIZE + WALL_PADDING;
        var x2 = (inX + 2) * CELL_SIZE - WALL_PADDING;
        var y = (inY + 1) * CELL_SIZE;

        context.moveTo(x1, y);
        context.lineTo(x2, y);
    }
    else // Direction.VERTICAL
    {
        var x = (inX + 1) * CELL_SIZE;
        var y1 = inY * CELL_SIZE + WALL_PADDING;
        var y2 = (inY + 2) * CELL_SIZE - WALL_PADDING;
        context.moveTo(x, y1);
        context.lineTo(x, y2);
    }
    context.stroke();
}

initGameState();
drawGridLines();
drawWall(3,7,Player.RED,Direction.HORIZONTAL);
drawWall(3,7,Player.BLU,Direction.VERTICAL);
gameState.horizontalWalls[3][7] = true;

console.log(gameState.validMovementsRed);
gameState.verticalWalls[3][7] = true;
updateValidMovements();
console.log(gameState.validMovementsRed);
/*
context.clearRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
);*/

function getCanvasMousePosition (event) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

/*
// Mouse hover methods
canvas.addEventListener('mousemove', function(event) {
    var mousePosition = getCanvasMousePosition(event);
    console.log(mousePosition.x + ", " + mousePosition.y)
});
*/

canvas.addEventListener('click', function (event) {
    var mousePosition = getCanvasMousePosition(event);
    clickAt(mousePosition);
});