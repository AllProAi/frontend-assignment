import React, { useReducer, ReactNode } from 'react';
import { GameState, GameAction, ActionType } from '../models/types';
import {
  createEmptyGrid,
  createNewTetromino,
  isValidPosition,
  moveTetromino,
  placeTetromino,
  clearCompletedRows,
  isGameOver
} from '../utils/gameLogic/gameHelpers';
import { GameContext } from './gameContextTypes';

// Initial game state
const initialState: GameState = {
  grid: createEmptyGrid(),
  activeTetromino: null,
  nextTetromino: null,
  isPlaying: false,
  isGameOver: false
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
        isGameOver: false
      };
    }

    case ActionType.MOVE_LEFT: {
      if (!state.activeTetromino || !state.isPlaying) return state;
      
      const newTetromino = moveTetromino(state.activeTetromino, 'left');
      if (isValidPosition(state.grid, newTetromino)) {
        return {
          ...state,
          activeTetromino: newTetromino
        };
      }
      return state;
    }

    case ActionType.MOVE_RIGHT: {
      if (!state.activeTetromino || !state.isPlaying) return state;
      
      const newTetromino = moveTetromino(state.activeTetromino, 'right');
      if (isValidPosition(state.grid, newTetromino)) {
        return {
          ...state,
          activeTetromino: newTetromino
        };
      }
      return state;
    }

    case ActionType.MOVE_DOWN: {
      if (!state.activeTetromino || !state.isPlaying) return state;
      
      const newTetromino = moveTetromino(state.activeTetromino, 'down');
      if (isValidPosition(state.grid, newTetromino)) {
        return {
          ...state,
          activeTetromino: newTetromino
        };
      }
      // If can't move down further, place the tetromino
      return gameReducer(state, { type: ActionType.PLACE_TETROMINO });
    }

    case ActionType.AUTO_DROP: {
      if (!state.isPlaying) return state;
      return gameReducer(state, { type: ActionType.MOVE_DOWN });
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
          isGameOver: true
        };
      }
      
      // Continue with next tetromino
      return {
        ...state,
        grid: clearedGrid,
        activeTetromino: state.nextTetromino,
        nextTetromino: createNewTetromino()
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
        isGameOver: true
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