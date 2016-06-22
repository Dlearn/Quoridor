// Written by Dylan Ho 22/06/2016
// Code adapted from: http://codepen.io/solartic/pen/qEGqNL

'use strict';

// Number of ROWS and COLS
const COLS = 9; // ROWS by COLS cells
const ROWS = 9;

// Named-constants of the various dimensions used for graphics drawing
const CELL_SIZE = 50; // cell width and height (square)
const CELL_PADDING = CELL_SIZE / 6;
const CANVAS_WIDTH = CELL_SIZE * COLS;  // the drawing canvas
const CANVAS_HEIGHT = CELL_SIZE * ROWS;
const GRID_WIDTH = 3;                   // Grid-line's width
const GRID_WIDTH_HALF = GRID_WIDTH / 2; // Grid-line's half-width

// Players (circles) are displayed inside a cell, with padding from border
const SYMBOL_SIZE = CELL_SIZE - CELL_PADDING * 2; // width/height
const SYMBOL_STROKE_WIDTH = 4; // pen stroke width

// Wall constants
const WALL_STROKE_WIDTH = 5; // wall stroke width
const WALL_PADDING = CELL_SIZE / 10; // wall padding

// Javascript implementation of Enums. Could possibly use http://www.2ality.com/2016/01/enumify.html
const UDLR = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };
const Direction = { VERTICAL: 'VERTICAL', HORIZONTAL: 'HORIZONTAL'};
const Player = { RED: 'RED', BLU: 'BLU', EMPTY: 'EMPTY'};
const GameState = { PLAYING: 'PLAYING', RED_WON: 'RED_WON', BLU_WON: 'BLU_WON'};

var activePlayer = Player.RED;
var currentState = GameState.PLAYING;

var WALLLINE_WIDTH = 4;
var WALLLINE_COLOR = "#ddd";

var canvas = document.getElementById('quoridor-board');
var context = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
//context.translate(0.5, 0.5);

var gameState;

function initGameState()
{
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
    var validMovementsRed = [];
    var validMovementsBlu = [];

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
}

function addPlayingPiece (mouse) {
    var xCordinate;
    var yCordinate;

    for (var x = 0;x < COLS;x++) {
        for (var y = 0;y < ROWS;y++) {
            xCordinate = x * CELL_SIZE;
            yCordinate = y * CELL_SIZE;

            if (
                mouse.x >= xCordinate && mouse.x <= xCordinate + CELL_SIZE &&
                mouse.y >= yCordinate && mouse.y <= yCordinate + CELL_SIZE
            ) {

                clearPlayingArea(xCordinate, yCordinate);

                if (activePlayer === Player.RED) {
                    drawO(xCordinate, yCordinate, Player.RED);
                } else {
                    drawO(xCordinate, yCordinate, Player.BLU);
                }
            }
        }
    }
}

function clearPlayingArea (xCordinate, yCordinate) {
    context.fillStyle = "#fff";
    context.fillRect(
        xCordinate,
        yCordinate,
        CELL_SIZE,
        CELL_SIZE
    );
}
function drawO (xCordinate, yCordinate, inActivePlayer) {
    var halfSectionSize = CELL_SIZE / 2;
    var centerX = xCordinate + halfSectionSize;
    var centerY = yCordinate + halfSectionSize;
    var radius = CELL_SIZE / 3;

    context.lineWidth = 6;
    if (inActivePlayer === Player.RED) context.strokeStyle = "red";
    else if (inActivePlayer === Player.BLU) context.strokeStyle = "blue";
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();
}

function drawLines () {
    var lineStart = 0;
    var lineLength = CANVAS_WIDTH;
    context.lineWidth = WALLLINE_WIDTH;
    context.strokeStyle = WALLLINE_COLOR;
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

drawLines();

function getCanvasMousePosition (event) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

canvas.addEventListener('mouseup', function (event) {
    if (activePlayer === Player.RED) {
        activePlayer = Player.BLU;
    } else {
        activePlayer = Player.RED;
    }

    var canvasMousePosition = getCanvasMousePosition(event);
    addPlayingPiece(canvasMousePosition);
    drawLines();
});