package net.dlearn;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
/**
 * Quoridor: Two-player Graphics version with Simple-OO
 */
@SuppressWarnings("serial")
public class Quoridor extends JFrame {
    // Named-constants for the game board
    public static final int ROWS = 9;  // ROWS by COLS cells
    public static final int COLS = 9;
 
    // Named-constants of the various dimensions used for graphics drawing
    public static final int CELL_SIZE = 50; // cell width and height (square)
    public static final int CANVAS_WIDTH = CELL_SIZE * COLS;  // the drawing canvas
    public static final int CANVAS_HEIGHT = CELL_SIZE * ROWS;
    public static final int GRID_WIDTH = 3;                   // Grid-line's width
    public static final int GRID_WIDTH_HALF = GRID_WIDTH / 2; // Grid-line's half-width
    // Players (circles) are displayed inside a cell, with padding from border
    public static final int CELL_PADDING = CELL_SIZE / 6;
    public static final int SYMBOL_SIZE = CELL_SIZE - CELL_PADDING * 2; // width/height
    public static final int SYMBOL_STROKE_WIDTH = 4; // pen stroke width
    public static final int WALL_STROKE_WIDTH = 5; // wall stroke width
    public static final int WALL_PADDING = CELL_SIZE / 10; // wall padding

    // Use an enumeration (inner class) whose turn (or wall) it is
    public enum Player { RED, BLU, EMPTY }
    public static Player[][] horizontalWalls;
    public static Player[][] verticalWalls;
    private Player currentPlayer;  // the current player
    
    public static int redX;
    public static int redY;
    public static int bluX;
    public static int bluY;
 
    // Use an enumeration (inner class) to represent the various states of the game
    public enum GameState { PLAYING, RED_WON, BLU_WON }
    private GameState currentState;  // the current game state

    private DrawCanvas canvas; // Drawing canvas (JPanel) for the game board
    private JLabel statusBar;  // Status Bar
 
    /** Constructor to setup the game and the GUI components */
    public Quoridor() {
        canvas = new DrawCanvas();  // Construct a drawing canvas (a JPanel)
        canvas.setPreferredSize(new Dimension(CANVAS_WIDTH, CANVAS_HEIGHT));
 
        /*
        // The canvas (JPanel fires a MouseEvent upon mouse-enter
        canvas.addMouseListener(new MouseAdapter() {
        	@Override
        	public void mouseEntered(MouseEvent e) {
        		int mouseX = e.getX();
        		int mouseY = e.getY();
        		System.out.println(mouseX + ", " + mouseY);
        	}
        });
        */
        
        // The canvas (JPanel) fires a MouseEvent upon mouse-click
        canvas.addMouseListener(new MouseAdapter() {
        	@Override
        	public void mouseClicked(MouseEvent e) {  // mouse-clicked handler
        		int mouseX = e.getX();
        		int mouseY = e.getY();
        		// Get the row and column clicked
        		int rowSelected = mouseY / CELL_SIZE;
        		int colSelected = mouseX / CELL_SIZE;
 
        		// If playing, check whether the mouse click if valid
        		if (currentState == GameState.PLAYING) 
        		{
        			// Wall add logic - Check that you're clicking on a horizontal wall
    				int remainderX = mouseX % CELL_SIZE;
    				int remainderY = mouseY % CELL_SIZE;
    				
    				if (remainderY <= WALL_PADDING) 
    				{
    					if (remainderX <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected-1, true, currentPlayer);
    					else addWall(colSelected, rowSelected-1, true, currentPlayer);
    				}
    				else if (remainderY >= CELL_SIZE - WALL_PADDING)
    				{
    					if (remainderX <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected, true, currentPlayer);
    					else addWall(colSelected, rowSelected, true, currentPlayer);
    				}
    				// Check that you're clicking on a vertical wall
    				else if (remainderX <= WALL_PADDING)
    				{
    					if (remainderY <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected-1, false, currentPlayer);
    					else addWall(colSelected-1, rowSelected, false, currentPlayer);
    				}
    				else if (remainderX >= CELL_SIZE - WALL_PADDING)
    				{
    					if (remainderY <= CELL_SIZE / 2) addWall(colSelected, rowSelected-1, false, currentPlayer);
    					else addWall(colSelected, rowSelected, false, currentPlayer);
    				}
        			
        			// Player movement logic - If not adding a wall then check if mouse click is valid
    				else if (rowSelected >= 0 && rowSelected < ROWS && colSelected >= 0 && colSelected < COLS)
        			{
        				// Which player is it? 
        				if (currentPlayer == Player.RED)
        				{
        					// Is this a valid move for RED?
        					if (rowSelected == redY  && (colSelected == redX - 1 || colSelected == redX + 1))
        					{
        						redX = colSelected;
        						updateGame(); // update state & change active player
        					} else if (colSelected == redX  && (rowSelected == redY - 1 || rowSelected == redY + 1))
        					{
        						redY = rowSelected;
        						updateGame(); // update state & change active player
        					}
        				} else // currentPlayer == Player.BLU
        				{
        					// Is this a valid move for BLU?
        					if (rowSelected == bluY  && (colSelected == bluX - 1 || colSelected == bluX + 1))
        					{
        						bluX = colSelected;
        						updateGame(); // update state & change active player
        					} else if (colSelected == bluX  && (rowSelected == bluY - 1 || rowSelected == bluY + 1))
        					{	
        						bluY = rowSelected;
        						updateGame(); // update state & change active player
        					}
        				}
        			}
        		}
        		else { // currentState != GameState.PLAYING: Game Over
        			initGame(); // restart the game
        		}
        		repaint();  // Call-back paintComponent()
        	}
        });
 
        // Setup the status bar (JLabel) to display status message
        statusBar = new JLabel("  ");
        statusBar.setFont(new Font(Font.DIALOG_INPUT, Font.BOLD, 15));
        statusBar.setBorder(BorderFactory.createEmptyBorder(2, 5, 4, 5));
 
        Container cp = getContentPane();
        cp.setLayout(new BorderLayout());
        cp.add(canvas, BorderLayout.CENTER);
        cp.add(statusBar, BorderLayout.PAGE_END); // same as SOUTH
 
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        pack();  // pack all the components in this JFrame
        setTitle("Quoridor");
        setVisible(true);  // show this JFrame
 
        initGame(); // initialize the game board contents and game variables
    }
 
    /** Initialize the game-board contents and the status */
    public void initGame() {
        horizontalWalls = new Player[COLS-1][ROWS-1];
        verticalWalls = new Player[COLS-1][ROWS-1];
        for (int col = 0; col < COLS-1; col++) 
        {
        	for (int row = 0; row < ROWS-1; row++)
        	{
        		horizontalWalls[col][row] = Player.EMPTY;
        		verticalWalls[col][row] = Player.EMPTY;
        	}
        }
        
        // Initialize player starting positions
        redX = 4; redY = ROWS - 1;
	    bluX = 4; bluY = 0;
        currentState = GameState.PLAYING; // ready to play
        currentPlayer = Player.RED;       // cross plays first
    }
 
    // Update the currentState 
    public void updateGame() {
	    if (redY == 0) currentState = GameState.RED_WON;
	    else if (bluY == ROWS - 1) currentState = GameState.BLU_WON;
	    else currentPlayer = (currentPlayer == Player.RED) ? Player.BLU : Player.RED;
    }
    
    private boolean addWall(int col, int row, boolean isHorizontal, Player color) {
    	System.out.println("Trying to add at (col,row): "+col+", "+row);
    	
    	assert(color == Player.RED || color == Player.BLU);
    	// if horizontalWalls[col][row] == Player.RED / BLU
    	boolean clashesHorizontally = horizontalWalls[col][row] != Player.EMPTY;
    	//System.out.println("clashesHorizontally: "+clashesHorizontally);
    	// if verticalWalls[col][row] == Player.RED / BLU
    	boolean clashesVertically = verticalWalls[col][row] != Player.EMPTY;
    	//System.out.println("clashesVertically: "+clashesVertically);
    	
    	boolean clashesBack, clashesForward;
    	if (isHorizontal) // if isHorizontal check left and right (same row different col)
    	{
    		if (col != 0) clashesBack = horizontalWalls[col-1][row] != Player.EMPTY;
    		else clashesBack = false;
    		//System.out.println("clashesBack: "+clashesBack);
    		if (col != COLS-1) clashesForward = horizontalWalls[col+1][row] != Player.EMPTY;
    		else clashesForward = false;
    		//System.out.println("clashesForward: "+clashesForward);
    	} else // if !isHorizontal check up and down (same col different row)
    	{
    		if (row != 0) clashesBack = verticalWalls[col][row-1] != Player.EMPTY;
    		else clashesBack = false;
    		//System.out.println("clashesBack: "+clashesBack);
    		if (row != ROWS-1) clashesForward = verticalWalls[col][row+1] != Player.EMPTY;
    		else clashesForward = false;
    		//System.out.println("clashesForward: "+clashesForward);
    	}
    	
    	boolean clashes = clashesHorizontally || clashesVertically || clashesBack || clashesForward;
    	if (clashes) return false;
    	else 
    	{
    		if (isHorizontal)
    		{
    			horizontalWalls[col][row] = color;
    		} else
    		{
    			verticalWalls[col][row] = color;
    		}
    		//System.out.println("Sucessfully added wall at: "+row+","+col);
    		currentPlayer = (currentPlayer == Player.RED) ? Player.BLU : Player.RED;
    		return true;
    	}
    }
 
    // Inner class DrawCanvas (extends JPanel) used for custom graphics drawing.
    class DrawCanvas extends JPanel {
        @Override
        public void paintComponent(Graphics g) {  // invoke via repaint()
            super.paintComponent(g);    // fill background
            setBackground(Color.WHITE); // set its background color
 
            // Draw the grid-lines
            g.setColor(Color.LIGHT_GRAY);
            for (int row = 1; row < ROWS; ++row) g.fillRoundRect(0, CELL_SIZE * row - GRID_WIDTH_HALF, CANVAS_WIDTH-1, GRID_WIDTH, GRID_WIDTH, GRID_WIDTH);
            for (int col = 1; col < COLS; ++col) g.fillRoundRect(CELL_SIZE * col - GRID_WIDTH_HALF, 0, GRID_WIDTH, CANVAS_HEIGHT-1, GRID_WIDTH, GRID_WIDTH);
 
            // Draw the player tokens
            Graphics2D g2d = (Graphics2D)g;
            g2d.setStroke(new BasicStroke(SYMBOL_STROKE_WIDTH, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));  // Graphics2D only - for player symbols
            int xPrint, yPrint;
            xPrint = redX * CELL_SIZE + CELL_PADDING;
            yPrint = redY * CELL_SIZE + CELL_PADDING;
            g2d.setColor(Color.RED);
            g2d.drawOval(xPrint, yPrint, SYMBOL_SIZE, SYMBOL_SIZE);
         
            xPrint = bluX * CELL_SIZE + CELL_PADDING;
            yPrint = bluY * CELL_SIZE + CELL_PADDING;
            g2d.setColor(Color.BLUE);
            g2d.drawOval(xPrint, yPrint, SYMBOL_SIZE, SYMBOL_SIZE);
         
            // Draw the walls
            g2d.setStroke(new BasicStroke(WALL_STROKE_WIDTH, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));  // Graphics2D only - for wall drawing
            for (int col = 0; col < COLS-1; col++) 
            {
            	for (int row = 0; row < ROWS-1; row++)
            	{
            		// HORIZONTAL WALLS
            		if (horizontalWalls[col][row] == Player.RED)
            		{
            			int x1 = col * CELL_SIZE + WALL_PADDING;
            			int x2 = (col + 2) * CELL_SIZE - WALL_PADDING;
            			int y = (row + 1) * CELL_SIZE;
            			g2d.setColor(Color.RED);
                        g2d.drawLine(x1, y, x2, y);            			
            		} else if (horizontalWalls[col][row] == Player.BLU)
            		{
            			int x1 = col * CELL_SIZE + WALL_PADDING;
            			int x2 = (col + 2) * CELL_SIZE - WALL_PADDING;
            			int y = (row + 1) * CELL_SIZE;
            			g2d.setColor(Color.BLUE);
                        g2d.drawLine(x1, y, x2, y);
            		}
            		// VERTICAL WALLS
            		if (verticalWalls[col][row] == Player.RED)
            		{
            			int x = (col + 1) * CELL_SIZE;
            			int y1 = row * CELL_SIZE + WALL_PADDING;
            			int y2 = (row + 2) * CELL_SIZE - WALL_PADDING;
            			g2d.setColor(Color.RED);
                        g2d.drawLine(x, y1, x, y2);            			
            		} else if (verticalWalls[col][row] == Player.BLU)
            		{
            			int x = (col + 1) * CELL_SIZE;
            			int y1 = row * CELL_SIZE + WALL_PADDING;
            			int y2 = (row + 2) * CELL_SIZE - WALL_PADDING;
            			g2d.setColor(Color.BLUE);
                        g2d.drawLine(x, y1, x, y2);
            		}
            	}
            }
            
            
            // Print status-bar message
            if (currentState == GameState.PLAYING) {
            	statusBar.setForeground(Color.BLACK);
            	if (currentPlayer == Player.RED) {
            		statusBar.setText("RED's Turn");
            	} else {
            		statusBar.setText("BLUE's Turn");
            	}
            } else if (currentState == GameState.RED_WON) {
                statusBar.setForeground(Color.RED);
            	statusBar.setText("'RED' Won! Click to play again.");
            } else if (currentState == GameState.BLU_WON) {
            	statusBar.setForeground(Color.RED);
            	statusBar.setText("'BLUE' Won! Click to play again.");
            }
        }
    }
    
    /** The entry main() method */
    public static void main(String[] args) {
        // Run GUI codes in the Event-Dispatching thread for thread safety
    	SwingUtilities.invokeLater(new Runnable() {
    		@Override
            public void run() {
    			new Quoridor(); // Let the constructor do the job
    		}
    	});
    }
}