import React, { useReducer, ReactNode } from 'react';
import { GameState, GameAction, ActionType, LOCK_DELAY_MS } from '../models/types';
import {
  createEmptyGrid,
  createNewTetromino,
  isValidPosition,
  moveTetromino,
  placeTetromino,
  clearCompletedRows,
  isGameOver,
  wouldTetrominoLand,
  hasObstacleBelow
} from '../utils/gameLogic/gameHelpers';
import { GameContext } from './gameContextTypes';
import { INITIAL_STATE } from '../config/gameConfig';

// Initial game state
const initialState: GameState = {
  grid: createEmptyGrid(),
  activeTetromino: null,
  nextTetromino: null,
  isPlaying: INITIAL_STATE.IS_PLAYING,
  isGameOver: INITIAL_STATE.IS_GAME_OVER,
  lockDelay: false,
  lockDelayTimestamp: null
};

// Helper function to check and update lock delay status
const checkAndUpdateLockDelay = (state: GameState): GameState => {
  if (!state.activeTetromino || !state.isPlaying) return state;
  
  // Check if there's an obstacle below
  const hasObstacle = hasObstacleBelow(state.grid, state.activeTetromino);
  
  // If there's an obstacle below and we're not already in lock delay,
  // start the lock delay
  if (hasObstacle && !state.lockDelay) {
    return {
      ...state,
      lockDelay: true,
      lockDelayTimestamp: Date.now()
    };
  }
  
  // If there's no obstacle below but we are in lock delay,
  // cancel the lock delay
  if (!hasObstacle && state.lockDelay) {
    return {
      ...state,
      lockDelay: false,
      lockDelayTimestamp: null
    };
  }
  
  // No change needed
  return state;
};

// Game reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case ActionType.START_GAME: {
      const newTetromino = createNewTetromino();
      return {
        ...state,
        grid: createEmptyGrid(),
        activeTetromino: newTetromino,
        nextTetromino: createNewTetromino(),
        isPlaying: true,
        isGameOver: false,
        lockDelay: false,
        lockDelayTimestamp: null
      };
    }

    case ActionType.MOVE_LEFT: {
      if (!state.activeTetromino || !state.isPlaying) return state;
      
      const newTetromino = moveTetromino(state.activeTetromino, 'left');
      if (isValidPosition(state.grid, newTetromino)) {
        // Update tetromino position
        const updatedState = {
          ...state,
          activeTetromino: newTetromino
        };
        
        // Check for obstacles below and update lock delay status
        return checkAndUpdateLockDelay(updatedState);
      }
      return state;
    }

    case ActionType.MOVE_RIGHT: {
      if (!state.activeTetromino || !state.isPlaying) return state;
      
      const newTetromino = moveTetromino(state.activeTetromino, 'right');
      if (isValidPosition(state.grid, newTetromino)) {
        // Update tetromino position
        const updatedState = {
          ...state,
          activeTetromino: newTetromino
        };
        
        // Check for obstacles below and update lock delay status
        return checkAndUpdateLockDelay(updatedState);
      }
      return state;
    }

    case ActionType.MOVE_DOWN: {
      if (!state.activeTetromino || !state.isPlaying) return state;
      
      const newTetromino = moveTetromino(state.activeTetromino, 'down');
      if (isValidPosition(state.grid, newTetromino)) {
        // Update tetromino position
        const updatedState = {
          ...state,
          activeTetromino: newTetromino
        };
        
        // Check for obstacles below and update lock delay status
        return checkAndUpdateLockDelay(updatedState);
      }
      
      // Can't move down further, which means we're at an obstacle
      // If not already in lock delay, start it
      if (!state.lockDelay) {
        return {
          ...state,
          lockDelay: true,
          lockDelayTimestamp: Date.now()
        };
      }
      
      return state;
    }

    case ActionType.AUTO_DROP: {
      if (!state.isPlaying) return state;
      
      // If we're in lock delay, check if the time is up
      if (state.lockDelay && state.lockDelayTimestamp) {
        const now = Date.now();
        if (now - state.lockDelayTimestamp >= LOCK_DELAY_MS) {
          // Lock delay time is up, place the tetromino
          // This will happen regardless of user controls
          return gameReducer(state, { type: ActionType.FINISH_LOCK_DELAY });
        }
        
        // Still in lock delay, don't auto drop
        return state;
      }
      
      // Normal auto drop behavior
      if (state.activeTetromino) {
        const newTetromino = moveTetromino(state.activeTetromino, 'down');
        
        if (isValidPosition(state.grid, newTetromino)) {
          // Can move down
          const updatedState = {
            ...state,
            activeTetromino: newTetromino
          };
          
          // Check for obstacles below and update lock delay status
          return checkAndUpdateLockDelay(updatedState);
        } else {
          // Can't move down - start lock delay if not already started
          if (!state.lockDelay) {
            return {
              ...state,
              lockDelay: true,
              lockDelayTimestamp: Date.now()
            };
          }
        }
      }
      
      return state;
    }
    
    case ActionType.START_LOCK_DELAY: {
      if (!state.activeTetromino || !state.isPlaying || state.lockDelay) {
        return state;
      }
      
      return {
        ...state,
        lockDelay: true,
        lockDelayTimestamp: Date.now()
      };
    }
    
    case ActionType.CANCEL_LOCK_DELAY: {
      if (!state.lockDelay) {
        return state;
      }
      
      return {
        ...state,
        lockDelay: false,
        lockDelayTimestamp: null
      };
    }
    
    case ActionType.FINISH_LOCK_DELAY: {
      // End lock delay and place the tetromino
      return gameReducer({
        ...state,
        lockDelay: false,
        lockDelayTimestamp: null
      }, { type: ActionType.PLACE_TETROMINO });
    }

    case ActionType.PLACE_TETROMINO: {
      if (!state.activeTetromino || !state.isPlaying) return state;
      
      // Place active tetromino on the grid
      const newGrid = placeTetromino(state.grid, state.activeTetromino);
      
      // Check for completed rows
      const clearedGrid = clearCompletedRows(newGrid);
      
      // Check if we can place the next tetromino
      if (!state.nextTetromino || isGameOver(clearedGrid, state.nextTetromino)) {
        return {
          ...state,
          grid: clearedGrid,
          activeTetromino: null,
          isPlaying: false,
          isGameOver: true,
          lockDelay: false,
          lockDelayTimestamp: null
        };
      }
      
      // Continue with next tetromino
      return {
        ...state,
        grid: clearedGrid,
        activeTetromino: state.nextTetromino,
        nextTetromino: createNewTetromino(),
        lockDelay: false,
        lockDelayTimestamp: null
      };
    }

    case ActionType.CLEAR_LINES: {
      if (!state.isPlaying) return state;
      
      return {
        ...state,
        grid: clearCompletedRows(state.grid)
      };
    }

    case ActionType.GAME_OVER: {
      return {
        ...state,
        isPlaying: false,
        isGameOver: true,
        lockDelay: false,
        lockDelayTimestamp: null
      };
    }

    case ActionType.RESET_GAME: {
      return initialState;
    }

    default:
      return state;
  }
};

// Game provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}; 