// Written by Dylan Ho 23/06/2016

'use strict';



function isNextToWallOrBorder (inCol, inRow, inUDLR) {
    //console.log("Checking: " + inRow + ", " + inCol);
    var horizontalWalls = gameState.horizontalWalls;
    var verticalWalls = gameState.verticalWalls;

    if (inUDLR === UDLR.UP)
    {

        if (inRow === 0) return true;
        else if (inCol === 0) return horizontalWalls[0][inRow-1] !== Player.EMPTY;
        else if (inCol === COLS-1) return horizontalWalls[COLS-2][inRow-1] !== Player.EMPTY;
        else return horizontalWalls[inCol-1][inRow-1] !== Player.EMPTY || horizontalWalls[inCol][inRow-1] !== Player.EMPTY;
    }
    else if (inUDLR === UDLR.DOWN)
    {
        if (inRow === ROWS-1) return true;
        else if (inCol === 0) return horizontalWalls[0][inRow] !== Player.EMPTY;
        else if (inCol === COLS-1) return horizontalWalls[COLS-2][inRow] !== Player.EMPTY;
        else return horizontalWalls[inCol-1][inRow] !== Player.EMPTY || horizontalWalls[inCol][inRow] !== Player.EMPTY;
    }
    else if (inUDLR === UDLR.LEFT)
    {
        if (inCol === 0) return true;
        else if (inRow === 0) return verticalWalls[inCol-1][0] !== Player.EMPTY;
        else if (inRow === ROWS-1) return verticalWalls[inCol-1][ROWS-2] !== Player.EMPTY;
        else return verticalWalls[inCol-1][inRow-1] !== Player.EMPTY || verticalWalls[inCol-1][inRow] !== Player.EMPTY;
    }
    else // (inUDLR === UDLR.RIGHT)
    {
        if (inCol === COLS-1) return true;
        else if (inRow === 0) return verticalWalls[inCol][0] !== Player.EMPTY;
        else if (inRow === ROWS-1) return verticalWalls[inCol][ROWS-2] !== Player.EMPTY;
        else return verticalWalls[inCol][inRow-1] !== Player.EMPTY || verticalWalls[inCol][inRow] !== Player.EMPTY;
    }
}

function updateValidMovements () {
    var validMovements = [];
    var activeX, activeY, inactiveX, inactiveY;
    if (gameState.activePlayer === Player.RED)
    {
        activeX = gameState.redX;
        activeY = gameState.redY;
        inactiveX = gameState.bluX;
        inactiveY = gameState.bluY;
    }
    else // gameState.activePlayer === Player.BLU
    {
        activeX = gameState.bluX;
        activeY = gameState.bluY;
        inactiveX = gameState.redX;
        inactiveY = gameState.redY;
    }
    var isNextToOpponent, opponentHasWallBehindHim;

    // Check if can move up
    if (!isNextToWallOrBorder(activeX, activeY, UDLR.UP))
    {
        isNextToOpponent = inactiveX === activeX && inactiveY === activeY - 1;
        if (!isNextToOpponent) validMovements.push([activeX,activeY-1]);
        else
        {
            opponentHasWallBehindHim = isNextToWallOrBorder(inactiveX, inactiveY, UDLR.UP);
            if (!opponentHasWallBehindHim) validMovements.push([activeX,activeY-2]);
            else
            {
                if (!isNextToWallOrBorder(inactiveX, inactiveY, UDLR.LEFT)) validMovements.push([inactiveX-1,inactiveY]);
                if (!isNextToWallOrBorder(inactiveX, inactiveY, UDLR.RIGHT)) validMovements.push([inactiveX+1,inactiveY]);
            }
        }
    }

    // Check if can move down
    if (!isNextToWallOrBorder(activeX, activeY, UDLR.DOWN))
    {
        isNextToOpponent = inactiveX === activeX && inactiveY === activeY + 1;
        if (!isNextToOpponent) validMovements.push([activeX,activeY+1]);
        else
        {
            opponentHasWallBehindHim = isNextToWallOrBorder(inactiveX, inactiveY, UDLR.DOWN);
            if (!opponentHasWallBehindHim) validMovements.push([activeX,activeY+2]);
            else
            {
                if (!isNextToWallOrBorder(inactiveX, inactiveY, UDLR.LEFT)) validMovements.push([inactiveX-1,inactiveY]);
                if (!isNextToWallOrBorder(inactiveX, inactiveY, UDLR.RIGHT)) validMovements.push([inactiveX+1,inactiveY]);
            }
        }
    }

    // Check if can move left
    if (!isNextToWallOrBorder(activeX, activeY, UDLR.LEFT))
    {
        isNextToOpponent = inactiveX === activeX-1 && inactiveY === activeY;
        if (!isNextToOpponent) validMovements.push([activeX-1,activeY]);
        else // can jump
        {
            opponentHasWallBehindHim = isNextToWallOrBorder(inactiveX, inactiveY, UDLR.LEFT);
            if (!opponentHasWallBehindHim) validMovements.push([activeX-2,activeY]);
            else
            {
                if (!isNextToWallOrBorder(inactiveX, inactiveY, UDLR.UP)) validMovements.push([inactiveX,inactiveY-1]);
                if (!isNextToWallOrBorder(inactiveX, inactiveY, UDLR.DOWN)) validMovements.push([inactiveX,inactiveY+1]);
            }
        }
    }

    // Check if can move right
    if (!isNextToWallOrBorder(activeX,activeY,UDLR.RIGHT))
    {
        isNextToOpponent = inactiveX === activeX + 1 && inactiveY === activeY;
        if (!isNextToOpponent) validMovements.push([activeX+1,activeY]);
        else
        {
            opponentHasWallBehindHim = isNextToWallOrBorder(inactiveX, inactiveY, UDLR.RIGHT);
            if (!opponentHasWallBehindHim) validMovements.push([activeX+2,activeY]);
            else
            {
                if (!isNextToWallOrBorder(inactiveX, inactiveY, UDLR.UP)) validMovements.push([inactiveX,inactiveY-1]);
                if (!isNextToWallOrBorder(inactiveX, inactiveY, UDLR.DOWN)) validMovements.push([inactiveX,inactiveY+1]);
            }
        }
    }

    if (gameState.activePlayer === Player.RED) gameState.validMovementsRed = validMovements;
    else gameState.validMovementsBlu = validMovements;
}