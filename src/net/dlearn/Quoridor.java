package net.dlearn;
import static net.dlearn.Consts.*;
import static net.dlearn.Common.*;

import java.awt.*;
import java.awt.event.*;
import java.util.*;
import javax.swing.*;
/**
 * Quoridor: Two-player Graphics version with Simple-OO
 */
@SuppressWarnings("serial")
public class Quoridor extends JFrame {
	
    LinkedList<Integer> validMovementCoords;
    
    // Use an enumeration (inner class) to represent the various states of the game
    public enum GameState { PLAYING, RED_WON, BLU_WON }
    private Player currentPlayer;  // the current player
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
    				//System.out.println("remainderX: " + remainderX + ", remainderY:" + remainderY);
    				
    				if (remainderY <= WALL_PADDING) 
    				{
    					if (remainderX <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected-1, Direction.HORIZONTAL, currentPlayer);
    					else addWall(colSelected, rowSelected-1, Direction.HORIZONTAL, currentPlayer);
    				}
    				else if (remainderY >= CELL_SIZE - WALL_PADDING)
    				{
    					if (remainderX <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected, Direction.HORIZONTAL, currentPlayer);
    					else addWall(colSelected, rowSelected, Direction.HORIZONTAL, currentPlayer);
    				}
    				// Check that you're clicking on a vertical wall
    				else if (remainderX <= WALL_PADDING)
    				{
    					if (remainderY <= CELL_SIZE / 2) addWall(colSelected-1, rowSelected-1, Direction.VERTICAL, currentPlayer);
    					else addWall(colSelected-1, rowSelected, Direction.VERTICAL, currentPlayer);
    				}
    				else if (remainderX >= CELL_SIZE - WALL_PADDING)
    				{
    					if (remainderY <= CELL_SIZE / 2) addWall(colSelected, rowSelected-1, Direction.VERTICAL, currentPlayer);
    					else addWall(colSelected, rowSelected, Direction.VERTICAL, currentPlayer);
    				}
        			
        			// Player movement logic - If not adding a wall then check if mouse click is valid
    				else if (rowSelected >= 0 && rowSelected < ROWS && colSelected >= 0 && colSelected < COLS)
        			{
    					Object[] arrayedList = validMovementCoords.toArray();
    					for(int i=0; i<arrayedList.length/2; i++)
    					{
    						int validX = (int) arrayedList[i*2];
    						int validY = (int) arrayedList[i*2+1];
    						if (colSelected == validX && rowSelected == validY)
    						{
    							if (currentPlayer == Player.RED)
    							{
    								redX = colSelected;
    								redY = rowSelected;
    							}
    							else // currentPlayer == Player.BLU
    							{
    								bluX = colSelected;
    								bluY = rowSelected;
    							}
    							updateGame();
    						}
    					}
        			}
        		}
        		else { // currentState != GameState.PLAYING: Game Over
        			initGame(); // restart the game
        		}
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
    private void initGame() {
        horizontalWalls = new Player[COLS-1][ROWS-1];
        verticalWalls = new Player[COLS-1][ROWS-1];
        validMovementCoords = new LinkedList<Integer>();
        for (int col = 0; col < COLS-1; col++) 
        {
        	for (int row = 0; row < ROWS-1; row++)
        	{
        		horizontalWalls[col][row] = Player.EMPTY;
        		verticalWalls[col][row] = Player.EMPTY;
        	}
        }
        
        // Test code for isNextToWall method
        //addWall(0,0,Direction.VERTICAL,Player.RED);
        //System.out.println(isNextToWall(1,2,UDLR.LEFT));
        
        // Initialize player starting positions
        redX = 4; redY = ROWS - 1;
	    bluX = 4; bluY = 0;
        currentState = GameState.PLAYING; // ready to play
        currentPlayer = Player.RED;       // red plays first
        updateValidMovementCoords();
        repaint();
    }
 
    private boolean addWall(int col, int row, Direction inDirection, Player inColor) {
    	//Hack to clamp the wall addition
    	if (col == -1) col = 0;
    	else if (col == COLS-1) col = COLS-2;
    	if (row == -1) row = 0;
    	else if (row == ROWS-1) row = ROWS-2;
    	
    	if (inColor == Player.EMPTY) throw new AssertionError();
    	// if horizontalWalls[col][row] == Player.RED / BLU
    	boolean clashesHorizontally = horizontalWalls[col][row] != Player.EMPTY;
    	//System.out.println("clashesHorizontally: "+clashesHorizontally);
    	// if verticalWalls[col][row] == Player.RED / BLU
    	boolean clashesVertically = verticalWalls[col][row] != Player.EMPTY;
    	//System.out.println("clashesVertically: "+clashesVertically);
    	
    	boolean clashesBack, clashesForward;
    	if (inDirection == Direction.HORIZONTAL) // if isHorizontal check left and right (same row different col)
    	{
    		if (col != 0) clashesBack = horizontalWalls[col-1][row] != Player.EMPTY;
    		else clashesBack = false;
    		//System.out.println("clashesBack: "+clashesBack);
    		if (col != COLS-2) clashesForward = horizontalWalls[col+1][row] != Player.EMPTY;
    		else clashesForward = false;
    		//System.out.println("clashesForward: "+clashesForward);
    	} else // Direction.VERTICAL check up and down (same col different row)
    	{
    		if (row != 0) clashesBack = verticalWalls[col][row-1] != Player.EMPTY;
    		else clashesBack = false;
    		//System.out.println("clashesBack: "+clashesBack);
    		if (row != ROWS-2) clashesForward = verticalWalls[col][row+1] != Player.EMPTY;
    		else clashesForward = false;
    		//System.out.println("clashesForward: "+clashesForward);
    	}
    	
    	boolean clashes = clashesHorizontally || clashesVertically || clashesBack || clashesForward;
    	if (clashes) return false;
    	else 
    	{
    		if (inDirection == Direction.HORIZONTAL)
    		{
    			horizontalWalls[col][row] = inColor;
    		} else // inDirection == Direction.VERTICAL
    		{
    			verticalWalls[col][row] = inColor;
    		}
    		//System.out.println("Successfully added wall at: "+row+","+col);
    		updateGame();
    		return true;
    	}
    }
    
    // Update the currentState 
    private void updateGame() {
	    if (redY == 0) currentState = GameState.RED_WON;
	    else if (bluY == ROWS - 1) currentState = GameState.BLU_WON;
	    currentPlayer = (currentPlayer == Player.RED) ? Player.BLU : Player.RED;
	    updateValidMovementCoords();
	    repaint();  // Call-back paintComponent()
    }
    
    private void updateValidMovementCoords()
    {
    	validMovementCoords.clear();
    	int activeX, activeY;
    	int inactiveX, inactiveY;
    	if (currentPlayer == Player.RED) 
    	{
    		activeX = redX; 
    		activeY = redY;
    		inactiveX = bluX;
    		inactiveY = bluY;
    	}
    	else // currentPlayer == Player.BLU 
    	{
    		activeX = bluX;
    		activeY = bluY;
    		inactiveX = redX;
    		inactiveY = redY;
    	}
    	boolean isNextToOpponent;
		if (activeX >= 1)  // Move left
		{
			if (!isNextToWall(activeX, activeY, UDLR.LEFT))
			{
				isNextToOpponent = inactiveX == activeX - 1 && inactiveY == activeY;
				if (!isNextToOpponent)
				{
					validMovementCoords.add(activeX - 1);
					validMovementCoords.add(activeY);
				}
				else // can jump
				{
					boolean opponentHasWallBehindHim = isNextToWall(inactiveX, inactiveY, UDLR.LEFT);
					if (!opponentHasWallBehindHim)
					{
						validMovementCoords.add(activeX - 2);
						validMovementCoords.add(activeY);
					}
					else
					{
						if (!isNextToWall(inactiveX, inactiveY, UDLR.UP))
						{
							validMovementCoords.add(inactiveX);
							validMovementCoords.add(inactiveY-1);
						}
						if (!isNextToWall(inactiveX, inactiveY, UDLR.DOWN))
						{
							validMovementCoords.add(inactiveX);
							validMovementCoords.add(inactiveY+1);
						}
					}
				}
			}
		}
		if (activeX <= COLS - 1) // Move right
		{
			if (!isNextToWall(activeX,activeY,UDLR.RIGHT))
			{
				isNextToOpponent = inactiveX == activeX + 1 && inactiveY == activeY;
				if (!isNextToOpponent)
				{
					validMovementCoords.add(activeX + 1);
					validMovementCoords.add(activeY);
				}
				else
				{
					boolean opponentHasWallBehindHim = isNextToWall(inactiveX, inactiveY, UDLR.RIGHT);
					if (!opponentHasWallBehindHim)
					{
						validMovementCoords.add(activeX + 2);
						validMovementCoords.add(activeY);
					}
					else
					{
						if (!isNextToWall(inactiveX, inactiveY, UDLR.UP))
						{
							validMovementCoords.add(inactiveX);
							validMovementCoords.add(inactiveY-1);
						}
						if (!isNextToWall(inactiveX, inactiveY, UDLR.DOWN))
						{
							validMovementCoords.add(inactiveX);
							validMovementCoords.add(inactiveY+1);
						}
					}
				}
			}
		}
		if (activeY >= 1) // Move up
		{
			if (!isNextToWall(activeX, activeY, UDLR.UP))
			{
				isNextToOpponent = inactiveX == activeX && inactiveY == activeY - 1;
				if (!isNextToOpponent)
				{
					validMovementCoords.add(activeX);
					validMovementCoords.add(activeY - 1);
				}
				else
				{
					boolean opponentHasWallBehindHim = isNextToWall(inactiveX, inactiveY, UDLR.UP);
					if (!opponentHasWallBehindHim)
					{
						validMovementCoords.add(activeX);
						validMovementCoords.add(activeY - 2);
					}
					else
					{
						if (!isNextToWall(inactiveX, inactiveY, UDLR.LEFT))
						{
							validMovementCoords.add(inactiveX-1);
							validMovementCoords.add(inactiveY);
						}
						if (!isNextToWall(inactiveX, inactiveY, UDLR.RIGHT))
						{
							validMovementCoords.add(inactiveX+1);
							validMovementCoords.add(inactiveY);
						}
					}
				}
			}
		}
		if (activeY <= ROWS - 1) // Move down
		{
			if (!isNextToWall(activeX, activeY, UDLR.DOWN))
			{
				isNextToOpponent = inactiveX == activeX && inactiveY == activeY + 1; 
				if (!isNextToOpponent)
				{
					validMovementCoords.add(activeX);
					validMovementCoords.add(activeY + 1);
				}
				else
				{
					boolean opponentHasWallBehindHim = isNextToWall(inactiveX, inactiveY, UDLR.DOWN);
					if (!opponentHasWallBehindHim)
					{
						validMovementCoords.add(activeX);
						validMovementCoords.add(activeY + 2);
					}
					else
					{
						if (!isNextToWall(inactiveX, inactiveY, UDLR.LEFT))
						{
							validMovementCoords.add(inactiveX-1);
							validMovementCoords.add(inactiveY);
						}
						if (!isNextToWall(inactiveX, inactiveY, UDLR.RIGHT))
						{
							validMovementCoords.add(inactiveX+1);
							validMovementCoords.add(inactiveY);
						}
					}
				}
			}
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