import { Grid, GridCell, Tetromino, GRID_WIDTH, GRID_HEIGHT } from '../../models/types';
import { getRandomTetromino } from './tetrominos';

// Initialize empty grid
export const createEmptyGrid = (): Grid => {
  return Array.from({ length: GRID_HEIGHT }, () => 
    Array.from({ length: GRID_WIDTH }, (): GridCell => ({ filled: false, color: null }))
  );
};

// Create a new tetromino at the top left of the grid
export const createNewTetromino = (): Tetromino => {
  const shape = getRandomTetromino();
  
  return {
    shape,
    position: {
      // Position at top left corner
      x: 0,
      y: 0
    }
  };
};

// Check if the tetromino has valid position
export const isValidPosition = (grid: Grid, tetromino: Tetromino): boolean => {
  const { matrix } = tetromino.shape;
  const { x, y } = tetromino.position;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]) {
        const gridX = x + col;
        const gridY = y + row;

        // Check grid boundaries
        if (
          gridX < 0 || 
          gridX >= GRID_WIDTH || 
          gridY >= GRID_HEIGHT
        ) {
          return false;
        }

        // Check collision with other pieces
        if (gridY >= 0 && grid[gridY][gridX].filled) {
          return false;
        }
      }
    }
  }

  return true;
};

// Move tetromino in specified direction
export const moveTetromino = (
  tetromino: Tetromino, 
  direction: 'left' | 'right' | 'down'
): Tetromino => {
  const newPosition = { ...tetromino.position };
  
  if (direction === 'left') {
    newPosition.x -= 1;
  } else if (direction === 'right') {
    newPosition.x += 1;
  } else if (direction === 'down') {
    newPosition.y += 1;
  }

  return {
    ...tetromino,
    position: newPosition
  };
};

// Place tetromino onto the grid
export const placeTetromino = (grid: Grid, tetromino: Tetromino): Grid => {
  const newGrid = grid.map(row => [...row]);
  const { matrix, color } = tetromino.shape;
  const { x, y } = tetromino.position;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]) {
        const gridY = y + row;
        const gridX = x + col;
        
        // Only place if within grid bounds
        if (gridY >= 0 && gridY < GRID_HEIGHT && gridX >= 0 && gridX < GRID_WIDTH) {
          newGrid[gridY][gridX] = { filled: true, color };
        }
      }
    }
  }

  return newGrid;
};

// Check for and clear completed rows
export const clearCompletedRows = (grid: Grid): Grid => {
  const newGrid = [...grid];
  let rowsCleared = 0;

  // Find completed rows
  for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
    if (newGrid[row].every(cell => cell.filled)) {
      // Remove the row
      newGrid.splice(row, 1);
      rowsCleared++;
    }
  }

  // Add new empty rows at the top
  const emptyRows = Array.from({ length: rowsCleared }, () => 
    Array.from({ length: GRID_WIDTH }, (): GridCell => ({ filled: false, color: null }))
  );
  
  return [...emptyRows, ...newGrid];
};

// Check if game is over (can't place new tetromino)
export const isGameOver = (grid: Grid, tetromino: Tetromino): boolean => {
  return !isValidPosition(grid, tetromino);
}; 