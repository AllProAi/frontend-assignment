import { createContext, useContext } from 'react';
import { GameState, GameAction } from '../models/types';

// Context type definition
export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// Create the game context
export const GameContext = createContext<GameContextType | undefined>(undefined);

// Custom hook to use the game context
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 