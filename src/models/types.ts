import { GRID_CONFIG, TIMING_CONFIG } from '../config/gameConfig';

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
  lockDelay: boolean;      // Whether piece is in lock delay
  lockDelayTimestamp: number | null;  // When the lock delay started
}

export enum ActionType {
  START_GAME = 'START_GAME',
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  MOVE_DOWN = 'MOVE_DOWN',
  AUTO_DROP = 'AUTO_DROP',
  PLACE_TETROMINO = 'PLACE_TETROMINO',
  START_LOCK_DELAY = 'START_LOCK_DELAY',
  CANCEL_LOCK_DELAY = 'CANCEL_LOCK_DELAY',
  FINISH_LOCK_DELAY = 'FINISH_LOCK_DELAY',
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
  | { type: ActionType.START_LOCK_DELAY }
  | { type: ActionType.CANCEL_LOCK_DELAY }
  | { type: ActionType.FINISH_LOCK_DELAY }
  | { type: ActionType.CLEAR_LINES }
  | { type: ActionType.GAME_OVER }
  | { type: ActionType.RESET_GAME };

export const GRID_WIDTH = GRID_CONFIG.WIDTH;
export const GRID_HEIGHT = GRID_CONFIG.HEIGHT;
export const LOCK_DELAY_MS = TIMING_CONFIG.LOCK_DELAY; 