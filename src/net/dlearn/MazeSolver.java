package net.dlearn;
import static net.dlearn.Consts.*;
import static net.dlearn.Common.*;

public class MazeSolver {
	
	private static boolean[][] wasHere = new boolean[COLS][ROWS];
	
	public static boolean isSolvable()
	{
		for (int col = 0; col < COLS; col++){
			for(int row = 0; row < ROWS; row++){
				wasHere[col][row] = false;
			}
		}
		/*
		startRedX = inRedX;
		startRedY = inRedY;
		startBluX = inBluX;
		startBluY = inBluY;
		*/
		
		// Red must be able to get to row = 0
		// Blu must be able to get to row = ROWS-1
		boolean redPossible = recursiveSolve(redX, redY, Player.RED);
		boolean bluPossible = recursiveSolve(bluX, bluY, Player.BLU);
		return redPossible && bluPossible;
	}

	private static boolean recursiveSolve(int inX, int inY, Player inColor)
	{
		if (inColor == Player.EMPTY) throw new AssertionError();
		
		// Teriminating Condition
		if (inColor == Player.RED && inY == 0) return true;
		else if (inColor == Player.BLU && inY == ROWS-1) return true;
		if (wasHere[inX][inY]) return false;
		return true;
	}
}
