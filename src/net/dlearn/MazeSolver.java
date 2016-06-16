package net.dlearn;
import static net.dlearn.Consts.*;

public class MazeSolver {
	
	boolean[][] wasHere = new boolean[COLS][ROWS];
	
	public boolean isSolvable(int inRedX, int inRedY, int inBluX, int inBluY, Player[][] inHorizontalWalls, Player[][] inVerticalWalls)
	{
		// Red must be able to get to row = 0
		// Blu must be able to get to row = ROWS-1
		return true;
	}

	private boolean recursiveSolve(int inX, int inY, Player inColor)
	{
		if (inColor == Player.EMPTY) throw new AssertionError();
		
		// Teriminating Condition
		if (inColor == Player.RED && inY == 0) return true;
		else if (inColor == Player.BLU && inY == ROWS-1) return true;
		if (wasHere[inX][inY]) return false;
		return true;
	}
}
