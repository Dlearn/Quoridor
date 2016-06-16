package net.dlearn;
import static net.dlearn.Consts.*;

public class Common {
	static Player[][] horizontalWalls;
    static Player[][] verticalWalls;
    static int redX, redY, bluX, bluY;
	
	static boolean isNextToWall (int inCol, int inRow, UDLR inUDLR)
    {
    	if (inUDLR == UDLR.UP) 
    	{
    		//if (inRow == 0) throw new AssertionError();
    		if (inRow == 0) return true;
    		else if (inCol == 0) return horizontalWalls[0][inRow-1] != Player.EMPTY;
    		else if (inCol == COLS-1) return horizontalWalls[COLS-2][inRow-1] != Player.EMPTY;
    		else return horizontalWalls[inCol-1][inRow-1] != Player.EMPTY || horizontalWalls[inCol][inRow-1] != Player.EMPTY;
    	}
    	else if (inUDLR == UDLR.DOWN) 
    	{
    		if (inRow == ROWS-1) return true;
    		else if (inCol == 0) return horizontalWalls[0][inRow] != Player.EMPTY;
    		else if (inCol == COLS-1) return horizontalWalls[COLS-2][inRow] != Player.EMPTY;
    		else return horizontalWalls[inCol-1][inRow] != Player.EMPTY || horizontalWalls[inCol][inRow] != Player.EMPTY;
    	}
    	else if (inUDLR == UDLR.LEFT) 
    	{
    		if (inCol == 0) return true;
    		else if (inRow == 0) return verticalWalls[inCol-1][0] != Player.EMPTY;
    		else if (inRow == ROWS-1) return verticalWalls[inCol-1][ROWS-2] != Player.EMPTY;
    		else return verticalWalls[inCol-1][inRow-1] != Player.EMPTY || verticalWalls[inCol-1][inRow] != Player.EMPTY;
    	}
    	else // (inUDLR == UDLR.RIGHT)
    	{
    		if (inCol == COLS-1) return true;
    		else if (inRow == 0) return verticalWalls[inCol][0] != Player.EMPTY;
    		else if (inRow == ROWS-1) return verticalWalls[inCol][ROWS-2] != Player.EMPTY;
    		else return verticalWalls[inCol][inRow-1] != Player.EMPTY || verticalWalls[inCol][inRow] != Player.EMPTY;
    	}
    }
}
