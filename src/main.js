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
const CIRCLE_LINEWIDTH = 2; // pen stroke width

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

const NOTATION_PADDING = 35;
var gameText = document.getElementById('game-text');
gameText.width = NOTATION_PADDING + CANVAS_WIDTH;
gameText.height = NOTATION_PADDING + 10;
var gameTextContext = gameText.getContext('2d');
gameTextContext.font = "22px Palatino";
gameTextContext.fillText("WELCOME TO QUORIDOR!", 55, 25);

var leftNotation = document.getElementById('left-notation');
leftNotation.width = NOTATION_PADDING;
leftNotation.height = CANVAS_HEIGHT;
var leftContext = leftNotation.getContext('2d');
leftContext.font = "26px Arial";
for (var i=0; i < ROWS; i++) leftContext.fillText(9-i, 10, 35+i*CELL_SIZE);
var botNotation = document.getElementById('bot-notation');
botNotation.width = NOTATION_PADDING + CANVAS_WIDTH;
botNotation.height = NOTATION_PADDING;
var botContext = botNotation.getContext('2d');
botContext.font = "26px Arial";
for (var i=0; i < ROWS; i++) botContext.fillText(String.fromCharCode(65+i), 55+i*CELL_SIZE, 25);

var canvas = document.getElementById('quoridor-board');
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

    context.lineWidth = 4;
    context.strokeStyle = "black";
    context.beginPath();
    // Horizontal Lines
    context.moveTo(0, 0);
    context.lineTo(CANVAS_WIDTH, 0);
    context.moveTo(0, CANVAS_HEIGHT);
    context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    // Vertical Lines
    context.moveTo(0, 0);
    context.lineTo(0, CANVAS_HEIGHT);
    context.moveTo(CANVAS_WIDTH, 0);
    context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);

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
            if (remainderX <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected-1, Direction.HORIZONTAL, gameState.activePlayer);
            else addWall(colSelected, rowSelected-1, Direction.HORIZONTAL, gameState.activePlayer);
        }
        else if (remainderY >= CELL_SIZE - WALL_PADDING)
        {
            if (remainderX <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected, Direction.HORIZONTAL, gameState.activePlayer);
            else addWall(colSelected, rowSelected, Direction.HORIZONTAL, gameState.activePlayer);
        }
        // Check that you're clicking on a vertical wall
        else if (remainderX <= WALL_PADDING)
        {
            if (remainderY <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected-1, Direction.VERTICAL, gameState.activePlayer);
            else addWall(colSelected-1, rowSelected, Direction.VERTICAL, gameState.activePlayer);
        }
        else if (remainderX >= CELL_SIZE - WALL_PADDING)
        {
            if (remainderY <= CELL_SIZE / 2) addWall(colSelected, rowSelected-1, Direction.VERTICAL, gameState.activePlayer);
            else addWall(colSelected, rowSelected, Direction.VERTICAL, gameState.activePlayer);
        }

        else {
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

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    if (inActivePlayer === Player.RED) context.fillStyle = "red";
    else if (inActivePlayer === Player.BLU) context.fillStyle = "blue";
    context.fill();
    context.lineWidth = CIRCLE_LINEWIDTH;
    context.strokeStyle = "black";
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

drawGridLines();
initGameState();

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