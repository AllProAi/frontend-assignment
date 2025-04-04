import { useEffect } from 'react';
import { ActionType, GameAction } from '../models/types';

type Dispatch = React.Dispatch<GameAction>;

export const useGameControls = (
  dispatch: Dispatch,
  isPlaying: boolean
): void => {
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          dispatch({ type: ActionType.MOVE_LEFT });
          break;
        case 'ArrowRight':
          event.preventDefault();
          dispatch({ type: ActionType.MOVE_RIGHT });
          break;
        case 'ArrowDown':
          event.preventDefault();
          dispatch({ type: ActionType.MOVE_DOWN });
          break;
        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [dispatch, isPlaying]);
};

export const useInterval = (
  callback: () => void,
  delay: number | null
): void => {
  useEffect(() => {
    if (delay === null) return;
    
    const intervalId = setInterval(callback, delay);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [callback, delay]);
}; 