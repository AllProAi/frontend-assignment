# Testris Game Development Documentation

## Project Overview
Testris is a browser-based Tetris-like game built with React and TypeScript. The game follows standard Tetris mechanics where tetrominos (geometric shapes) fall from the top of a grid, and the player aims to create complete horizontal lines that clear from the board.

## Architecture

### Technology Stack
- React 18+ (for UI components)
- TypeScript (for type safety)
- Styled-components (for styling)
- Vite (build system)
- React Context API (for state management)

### Directory Structure
```
src/
├── components/         # UI components
│   ├── Board/          # Game board component
│   ├── DevTools/       # Developer tools and testing utilities 
│   ├── LoadingScreen/  # Loading screen implementation
│   └── Sidebar/        # Game sidebar 
├── config/             # Game configuration
├── models/             # TypeScript interfaces and types
├── store/              # State management with React Context
├── utils/              # Helper functions
│   └── gameLogic/      # Game mechanics implementation
└── App.tsx             # Main application component
```

## Game Logic Implementation

### Tetromino Generation
The game implements the official "7-bag randomizer" algorithm for tetromino generation:
- Located in `src/utils/gameLogic/tetrominos.ts`
- The algorithm ensures each of the 7 tetromino types appears exactly once before any type repeats
- Uses a singleton pattern to ensure consistent randomization
- Maintains two bags of tetrominos (current and next) for sequence generation

Key implementation details:
```typescript
// The official Tetris 7-bag randomizer
class TetrominoRandomizer {
  private static instance: TetrominoRandomizer;
  private currentBag: string[] = [];
  private nextBag: string[] = [];
  
  // Get the next tetromino type from the current bag
  public getNextTetromino(): TetrominoShape {
    // If current bag is empty, move to the next bag
    if (this.currentBag.length === 0) {
      this.currentBag = [...this.nextBag];
      this.nextBag = [];
      this.fillBag(this.nextBag);
    }
    
    // Take the next piece from the current bag
    const nextType = this.currentBag.shift()!;
    
    return TETROMINOES[nextType];
  }
}
```

### Board Management
- Grid: 10x20 standard size (configurable in dev tools)
- Tetrominos spawn above the visible grid (with negative y-coordinate)
- Tetrominos are placed at the leftmost position (x=0)
- Game over occurs when a tetromino can't be placed at its spawn position or blocks reach the top row

Spawn position implementation:
```typescript
// Create a new tetromino above the grid
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
```

### Game State
- Implemented using React Context (`src/store/gameContext.tsx`)
- Manages the game grid, active tetromino, next tetromino, and game status
- Handles actions like movement, rotation, and line clearing
- Uses a reducer pattern for state transitions

Game state interface:
```typescript
export interface GameState {
  grid: Grid;
  activeTetromino: Tetromino | null;
  nextTetromino: Tetromino | null;
  isPlaying: boolean;
  isGameOver: boolean;
  lockDelay: boolean;      // Whether piece is in lock delay
  lockDelayTimestamp: number | null;  // When the lock delay started
}
```

### Core Game Files
- **tetrominos.ts**: Defines tetromino shapes and randomization algorithm
- **gameHelpers.ts**: Contains utility functions for game mechanics
- **gameContext.tsx**: Implements game state management
- **Board.tsx**: Renders the game board and handles user input

## Developer Tools
The game includes a developer toolset for testing and debugging:

- **DevToolsContainer**: Main wrapper for developer tools
  - Toggle visibility of developer tools panel
  - Contains the DevToolbar and TestUtils components

- **DevToolbar**: Provides game configuration and testing features
  - Grid dimensions configuration
  - Timing settings (auto-drop interval, lock delay)
  - Tetromino queue size configuration
  - Tetromino generation testing utilities

- **TestUtils**: Additional testing tools for tetromino generation

## Key Game Mechanics

### Tetromino Movement
- Left/right movement with boundary detection
- Downward movement with collision detection
- Auto-drop on a timer interval (configurable)

Movement implementation:
```typescript
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
```

### Collision Detection
- Boundary collision detection
- Block-to-block collision detection
- Only checks for collisions within the visible grid

Position validation:
```typescript
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
```

### Lock Delay System
- When a tetromino lands on a surface, a lock delay timer starts
- The player can still move the piece horizontally during this delay
- After the delay expires, the tetromino locks into place

Lock delay in the game reducer:
```typescript
case ActionType.AUTO_DROP: {
  if (!state.isPlaying || !state.activeTetromino) return state;
  
  // FIRST: Check if we're already in lock delay
  if (state.lockDelay && state.lockDelayTimestamp) {
    const now = Date.now();
    if (now - state.lockDelayTimestamp >= LOCK_DELAY_MS) {
      // Force immediate placement when lock delay expires
      return gameReducer(state, { type: ActionType.PLACE_TETROMINO });
    }
    
    // If still in lock delay, do nothing in auto drop
    return state;
  }
  
  // SECOND: If not in lock delay, check if we should be
  const shouldBeLocked = hasObstacleBelow(state.grid, state.activeTetromino);
  if (shouldBeLocked) {
    return {
      ...state,
      lockDelay: true,
      lockDelayTimestamp: Date.now()
    };
  }
  
  // THIRD: If no obstacles below, proceed with normal drop
  // ...
}
```

### Line Clearing
- Completed horizontal lines are detected and removed
- Blocks above cleared lines fall down to fill the gaps

Line clearing implementation:
```typescript
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
```

## Configuration Options
All game settings are configurable through developer tools:

- **Grid Dimensions**: Width and height of the game grid
- **Auto-Drop Interval**: Speed at which tetrominos automatically fall
- **Lock Delay**: Time before a landed tetromino locks into place
- **Tetromino Queue Size**: Number of tetrominos to prepare in advance

Configuration is managed in `src/config/gameConfig.ts`.

## Known Issues and Limitations

1. The `expected position` in the position test still shows (0,0) even though tetrominos spawn above the grid at (-height, 0).

2. There was a duplicate configuration panel in the DevTools that has been fixed by removing the configuration section from DevToolsContainer.

3. The game doesn't currently implement:
   - Tetromino rotation
   - Scoring system
   - Level progression with increased difficulty

## Development Guidance

### Adding Features
- To add new tetromino shapes, modify the `TETROMINOES` object in `tetrominos.ts`
- For new game mechanics, add appropriate action types to `models/types.ts` and handlers in the reducer in `gameContext.tsx`
- UI enhancements should be added to the respective component files

### Testing
- Use the built-in developer tools to test tetromino generation
- The DevToolbar includes functions to verify distribution and sequence patterns

### Setup for Development
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Access the game at http://localhost:5173 (or the port displayed in your terminal)

4. Build for production:
   ```bash
   pnpm build
   ``` 