package net.dlearn;
import static net.dlearn.Consts.*;

public class MazeSolver {
	
	private static boolean[][] wasHere = new boolean[COLS][ROWS];
	//private static int startRedX, startRedY, startBluX, startBluY;
	private static Player[][] horizontalWalls;
	private static Player[][] verticalWalls;
	
	public static boolean isSolvable(int inRedX, int inRedY, int inBluX, int inBluY, Player[][] inHorizontalWalls, Player[][] inVerticalWalls)
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
		horizontalWalls = inHorizontalWalls;
		verticalWalls = inVerticalWalls;
		// Red must be able to get to row = 0
		// Blu must be able to get to row = ROWS-1
		boolean redPossible = recursiveSolve(inRedX, inRedY, Player.RED);
		boolean bluPossible = recursiveSolve(inBluX, inBluY, Player.BLU);
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
