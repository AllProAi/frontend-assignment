import { Grid, GridCell, Tetromino, GRID_WIDTH, GRID_HEIGHT } from '../../models/types';
import { getRandomTetromino } from './tetrominos';

// Initialize empty grid
export const createEmptyGrid = (): Grid => {
  return Array.from({ length: GRID_HEIGHT }, () => 
    Array.from({ length: GRID_WIDTH }, (): GridCell => ({ filled: false, color: null }))
  );
};

// Create a new tetromino centered above the grid
export const createNewTetromino = (): Tetromino => {
  const shape = getRandomTetromino();
  
  return {
    shape,
    position: {
      // Position at the leftmost side (x=0)
      x: 0,
      // Start above the visible grid
      y: -shape.matrix.length
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

        // Check horizontal and bottom boundaries
        if (
          gridX < 0 || 
          gridX >= GRID_WIDTH || 
          gridY >= GRID_HEIGHT
        ) {
          return false;
        }

        // Check collision with other pieces, but only for cells within the grid
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
        
        // Only place if within grid bounds - ignore parts above the grid (negative y)
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
  // Check if the new tetromino collides with existing blocks
  // This happens when a piece is locked too high, blocking the spawn area
  if (!isValidPosition(grid, tetromino)) {
    return true;
  }
  
  // Also check if any blocks exist in the top row (row 0)
  // This means the stack has reached the top of the grid
  if (grid[0].some(cell => cell.filled)) {
    return true;
  }
  
  return false;
};

// Check if the tetromino would land in the next step
export const wouldTetrominoLand = (grid: Grid, tetromino: Tetromino): boolean => {
  // Create a copy of the tetromino moved down by one position
  const nextPosition = {
    ...tetromino.position,
    y: tetromino.position.y + 1
  };
  
  const tetrominoBelow = {
    ...tetromino,
    position: nextPosition
  };
  
  // If the position below is invalid, it means the tetromino would land
  return !isValidPosition(grid, tetrominoBelow);
};

// Check if there is something directly below the tetromino (filled cell or bottom boundary)
export const hasObstacleBelow = (grid: Grid, tetromino: Tetromino): boolean => {
  const { matrix } = tetromino.shape;
  const { x, y } = tetromino.position;

  // Check each column of the tetromino's bottom row
  for (let col = 0; col < matrix[0].length; col++) {
    // Find the bottom-most filled cell in this column of the tetromino
    let bottomRowInColumn = -1;
    for (let row = matrix.length - 1; row >= 0; row--) {
      if (matrix[row][col]) {
        bottomRowInColumn = row;
        break;
      }
    }
    
    // If no filled cell in this column, continue to next column
    if (bottomRowInColumn === -1) continue;
    
    // Calculate grid position for this bottom-most cell
    const gridY = y + bottomRowInColumn + 1; // Position below the cell
    const gridX = x + col;
    
    // Check if we're at the bottom boundary
    if (gridY >= GRID_HEIGHT) {
      return true;
    }
    
    // Check if there's a filled cell below, but only if we're within the grid
    if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT && grid[gridY][gridX].filled) {
      return true;
    }
  }
  
  return false;
}; 