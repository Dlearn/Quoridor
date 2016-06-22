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
var GRIDLINE_WIDTH = 4;
var GRIDLINE_COLOR = "#ddd";

const WALL_STROKE_WIDTH = 5; // wall stroke width
const WALL_PADDING = CELL_SIZE / 10; // wall padding

// Javascript implementation of Enums. Could possibly use http://www.2ality.com/2016/01/enumify.html
const UDLR = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };
const Direction = { VERTICAL: 'VERTICAL', HORIZONTAL: 'HORIZONTAL'};
const Player = { RED: 'RED', BLU: 'BLU', EMPTY: 'EMPTY'};
const GameState = { PLAYING: 'PLAYING', RED_WON: 'RED_WON', BLU_WON: 'BLU_WON'};



var canvas = document.getElementById('quoridor-board');
var context = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var gameState;

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
    var currentState = GameState.PLAYING;
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
        currentState : currentState,
        activePlayer : activePlayer
    }

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

function addPlayingPiece (mouse) {
    var colSelected = Math.floor(mouse.x / CELL_SIZE);
    var rowSelected = Math.floor(mouse.y / CELL_SIZE);

    var activePlayer2 = gameState.activePlayer;
    var validMovements2;
    if (activePlayer2 === Player.RED) validMovements2 = gameState.validMovementsRed;
    else validMovements2 = gameState.validMovementsBlu; // Assume activePlayer !== Player.EMPTY
    for (var i=0; i<validMovements2.length; i++)
    {
        if (colSelected === validMovements2[i][0] && rowSelected === validMovements2[i][1])
        {
            console.log("Valid!: " + rowSelected + "," + colSelected);

            if (activePlayer2 === Player.RED)
            {
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

function updateGame() {
    if (gameState.redY === 0) gameState.currentState = GameState.RED_WON;
    else if (gameState.bluY === ROWS-1) gameState.currentState = GameState.BLU_WON;
    if (gameState.activePlayer === Player.RED) gameState.activePlayer = Player.BLU;
    else gameState.activePlayer = Player.RED;
    // Update validMovements
}

function clearPlayingArea (inX, inY) {
    context.fillStyle = "#fff";
    context.fillRect(
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
    console.log("Drawing a " + inActivePlayer + " wall at: " + inX + ", " + inY);
    if (inDirection === Direction.HORIZONTAL)
    {
        var x1 = inX * CELL_SIZE + WALL_PADDING;
        var x2 = (inX + 2) * CELL_SIZE - WALL_PADDING;
        //var y = (inY + 1) * CELL_SIZE;
        var y = 75;
        console.log(x1 + ", " + x2 + " at y: " + y);

        context.lineWidth = WALL_STROKE_WIDTH;
        if (inActivePlayer === Player.RED) context.strokeStyle = "red";
        else if (inActivePlayer === Player.BLU) context.strokeStyle = "blue";
        context.lineCap = 'round';
        context.beginPath();

        // Horizontal lines
        context.moveTo(x1, y * CELL_SIZE);
        context.lineTo(x2, y * CELL_SIZE);

        context.stroke();
    }
    else // Direction.VERTICAL
    {

    }
}

initGameState();
drawGridLines();
drawWall(0,0,Player.RED,Direction.HORIZONTAL);

function getCanvasMousePosition (event) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

canvas.addEventListener('mouseup', function (event) {
    var canvasMousePosition = getCanvasMousePosition(event);
    addPlayingPiece(canvasMousePosition);
});