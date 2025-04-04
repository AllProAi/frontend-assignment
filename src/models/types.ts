export interface GridCell {
  filled: boolean;
  color: string | null;
}

export type Grid = GridCell[][];

export interface TetrominoShape {
  matrix: boolean[][];
  color: string;
}

export interface Tetromino {
  shape: TetrominoShape;
  position: {
    x: number;
    y: number;
  };
}

export interface GameState {
  grid: Grid;
  activeTetromino: Tetromino | null;
  nextTetromino: Tetromino | null;
  isPlaying: boolean;
  isGameOver: boolean;
}

export enum ActionType {
  START_GAME = 'START_GAME',
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  MOVE_DOWN = 'MOVE_DOWN',
  AUTO_DROP = 'AUTO_DROP',
  PLACE_TETROMINO = 'PLACE_TETROMINO',
  CLEAR_LINES = 'CLEAR_LINES',
  GAME_OVER = 'GAME_OVER',
  RESET_GAME = 'RESET_GAME',
}

export type GameAction = 
  | { type: ActionType.START_GAME }
  | { type: ActionType.MOVE_LEFT }
  | { type: ActionType.MOVE_RIGHT }
  | { type: ActionType.MOVE_DOWN }
  | { type: ActionType.AUTO_DROP }
  | { type: ActionType.PLACE_TETROMINO }
  | { type: ActionType.CLEAR_LINES }
  | { type: ActionType.GAME_OVER }
  | { type: ActionType.RESET_GAME };

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20; 