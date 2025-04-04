// Game configuration file to centralize all game settings

// Grid dimensions
export const GRID_CONFIG = {
  WIDTH: 10,
  HEIGHT: 20
};

// Game timing (in milliseconds)
export const TIMING_CONFIG = {
  AUTO_DROP_INTERVAL: 1000, // Interval for auto-dropping pieces (1 second)
  LOCK_DELAY: 200           // Delay before locking a piece that has landed
};

// Tetromino generation config
export const TETROMINO_CONFIG = {
  QUEUE_SIZE: 14 // Keep 2 complete sets (7*2=14) in the queue by default
};

// Tetromino definitions with shapes and colors
export const TETROMINOES = {
  // O - Yellow Square
  O: {
    matrix: [
      [true, true],
      [true, true]
    ],
    color: '#FFFF00' // Yellow
  },
  // I - Cyan vertical line
  I: {
    matrix: [
      [true],
      [true],
      [true],
      [true]
    ],
    color: '#00FFFF' // Cyan
  },
  // S - Red S shape
  S: {
    matrix: [
      [false, true, true],
      [true, true, false]
    ],
    color: '#FF0000' // Red
  },
  // Z - Green Z shape
  Z: {
    matrix: [
      [true, true, false],
      [false, true, true]
    ],
    color: '#00FF00' // Green
  },
  // L - Orange L shape
  L: {
    matrix: [
      [true, false],
      [true, false],
      [true, true]
    ],
    color: '#FF7F00' // Orange
  },
  // J - Pink/Magenta J shape
  J: {
    matrix: [
      [false, true],
      [false, true],
      [true, true]
    ],
    color: '#FF00FF' // Pink/Magenta
  },
  // T - Purple T shape
  T: {
    matrix: [
      [true, true, true],
      [false, true, false]
    ],
    color: '#800080' // Purple
  }
};

// Initial state settings
export const INITIAL_STATE = {
  IS_PLAYING: false,
  IS_GAME_OVER: false
};

// Export a combined config object for use in DevToolbar
export const gameConfig = {
  grid: GRID_CONFIG,
  timing: TIMING_CONFIG,
  tetromino: TETROMINO_CONFIG,
  initialState: INITIAL_STATE
};

// Function to reset config to defaults
export const resetToDefaults = () => {
  GRID_CONFIG.WIDTH = 10;
  GRID_CONFIG.HEIGHT = 20;
  TIMING_CONFIG.AUTO_DROP_INTERVAL = 1000;
  TIMING_CONFIG.LOCK_DELAY = 200;
  TETROMINO_CONFIG.QUEUE_SIZE = 14;
}; 