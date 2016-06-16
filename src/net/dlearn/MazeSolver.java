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
		
		// Red must be able to get to row = 0
		// Blu must be able to get to row = ROWS-1
		boolean bluPossible = true;
		boolean redPossible = recursiveSolve(redX, redY, Player.RED);
		System.out.println("Is Red possible? "+redPossible);
		if (redPossible) 
		{
			for (int col = 0; col < COLS; col++){
				for(int row = 0; row < ROWS; row++){
					wasHere[col][row] = false;
				}
			}
			bluPossible = recursiveSolve(bluX, bluY, Player.BLU);
			System.out.println("Is Blu possible? "+bluPossible);
		}
		return redPossible && bluPossible;
	}

	private static boolean recursiveSolve(int inX, int inY, Player inColor)
	{
		if (inColor == Player.EMPTY) throw new AssertionError();
		
		// Teriminating Conditions
		if (inColor == Player.RED && inY == 0) return true;
		else if (inColor == Player.BLU && inY == ROWS-1) return true;
		if (wasHere[inX][inY]) 
		{
			System.out.println(inX+", "+inY+". Rats! We've been here before.");
			return false;
		}
		wasHere[inX][inY] = true;
		
		// Check if can go up
		boolean canGoUp = !isNextToWall(inX, inY, UDLR.UP) && !wasHere[inX][inY-1];
		boolean canGoDown = !isNextToWall(inX, inY, UDLR.DOWN) && !wasHere[inX][inY+1];
		boolean canGoLeft = !isNextToWall(inX, inY, UDLR.LEFT) && !wasHere[inX-1][inY];
		boolean canGoRight = !isNextToWall(inX, inY, UDLR.RIGHT) && !wasHere[inX+1][inY];
		
		if (canGoUp) 
		{
			System.out.println("From: " +inX+", "+inY+". We can go up, going.");
			if (recursiveSolve(inX, inY-1, inColor)) return true;
		}
		else System.out.println("From: " +inX+", "+inY+". We can't go up.");
		if (canGoDown){ 
			System.out.println("From: " +inX+", "+inY+". We can go down, going.");
			if (recursiveSolve(inX, inY+1, inColor)) return true;
		}
		else System.out.println("From: " +inX+", "+inY+". We can't go down.");
		if (canGoLeft)
		{
			System.out.println("From: " +inX+", "+inY+". We can go left, going.");
			if (recursiveSolve(inX-1, inY, inColor)) return true;
		}
		else System.out.println("From: " +inX+", "+inY+". We can't go left.");
		if (canGoRight)
		{
			System.out.println("From: " +inX+", "+inY+". We can go right, going.");
			if (recursiveSolve(inX+1, inY, inColor)) return true;
		}
		else System.out.println("From: " +inX+", "+inY+". We can't go right.");
		return false;
	}
}
