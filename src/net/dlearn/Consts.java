package net.dlearn;

public final class Consts {
    // Named-constants for the game board
	static final int ROWS = 9;  // ROWS by COLS cells
	static final int COLS = 9;
	 
	// Named-constants of the various dimensions used for graphics drawing
	static final int CELL_SIZE = 50; // cell width and height (square)
	static final int CELL_PADDING = CELL_SIZE / 6;
	static final int CANVAS_WIDTH = CELL_SIZE * COLS;  // the drawing canvas
	static final int CANVAS_HEIGHT = CELL_SIZE * ROWS;
	static final int GRID_WIDTH = 3;                   // Grid-line's width
	static final int GRID_WIDTH_HALF = GRID_WIDTH / 2; // Grid-line's half-width
	
	// Players (circles) are displayed inside a cell, with padding from border
	static final int SYMBOL_SIZE = CELL_SIZE - CELL_PADDING * 2; // width/height
	static final int SYMBOL_STROKE_WIDTH = 4; // pen stroke width
	
	// Wall constants
	static final int WALL_STROKE_WIDTH = 5; // wall stroke width
	static final int WALL_PADDING = CELL_SIZE / 10; // wall padding
	
	// Useful enums
	static enum UDLR { UP, DOWN, LEFT, RIGHT };
	static enum Direction { VERTICAL, HORIZONTAL };
	static enum Player { RED, BLU, EMPTY };
	
	private Consts()
	{
		// You're not allowed to call this constructor
		throw new AssertionError();
	}
}
