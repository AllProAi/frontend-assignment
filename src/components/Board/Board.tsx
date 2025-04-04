import React, { useCallback } from 'react';
import { ActionType } from '../../models/types';
import { useGameContext } from '../../store/gameContextTypes';
import { useGameControls, useInterval } from '../../hooks/useGameControls';
import { TIMING_CONFIG } from '../../config/gameConfig';
import {
  BoardContainer,
  GameBoard,
  Cell,
  GameControlsContainer,
  StartButton,
  GameStatus,
  GameTitle,
  GameInstructions,
  InstructionItem,
  KeyboardKey
} from './styles';

export const Board: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { grid, activeTetromino, isPlaying, isGameOver } = state;

  // Set up keyboard controls
  useGameControls(dispatch, isPlaying);

  // Auto-drop tetromino using configured interval
  useInterval(
    () => {
      dispatch({ type: ActionType.AUTO_DROP });
    },
    isPlaying ? TIMING_CONFIG.AUTO_DROP_INTERVAL : null
  );

  // Add a more frequent interval to ensure lock delay is checked more often
  useInterval(
    () => {
      // Only check if game is playing and we're in lock delay
      if (isPlaying && state.lockDelay) {
        dispatch({ type: ActionType.AUTO_DROP });
      }
    },
    isPlaying ? 50 : null // Check more frequently to ensure responsive lock delay
  );

  // Render the game board with active tetromino
  const renderBoard = useCallback(() => {
    // Clone the current grid
    const boardWithActiveTetromino = grid.map(row => [...row]);

    // Add active tetromino to the board for rendering
    if (activeTetromino) {
      const { matrix, color } = activeTetromino.shape;
      const { x, y } = activeTetromino.position;

      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col]) {
            const boardY = y + row;
            const boardX = x + col;

            // Only render if within the grid
            if (
              boardY >= 0 &&
              boardY < grid.length &&
              boardX >= 0 &&
              boardX < grid[0].length
            ) {
              boardWithActiveTetromino[boardY][boardX] = {
                filled: true,
                color
              };
            }
          }
        }
      }
    }

    // Render the cells
    return boardWithActiveTetromino.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          filled={cell.filled}
          color={cell.color}
        />
      ))
    );
  }, [grid, activeTetromino]);

  const handleStartGame = () => {
    dispatch({ type: ActionType.START_GAME });
  };

  const handleResetGame = () => {
    dispatch({ type: ActionType.RESET_GAME });
  };

  return (
    <BoardContainer>
      <GameTitle>Tetris</GameTitle>
      <GameBoard>{renderBoard()}</GameBoard>
      
      <GameControlsContainer>
        {isGameOver ? (
          <>
            <GameStatus>Game Over</GameStatus>
            <StartButton onClick={handleResetGame}>New Game</StartButton>
          </>
        ) : (
          <StartButton onClick={handleStartGame} disabled={isPlaying}>
            {isPlaying ? 'Playing...' : 'Start Game'}
          </StartButton>
        )}
      </GameControlsContainer>

      <GameInstructions>
        <h3>How to Play</h3>
        <InstructionItem>
          <KeyboardKey>←</KeyboardKey> Move Left
        </InstructionItem>
        <InstructionItem>
          <KeyboardKey>→</KeyboardKey> Move Right
        </InstructionItem>
        <InstructionItem>
          <KeyboardKey>↓</KeyboardKey> Move Down
        </InstructionItem>
      </GameInstructions>
    </BoardContainer>
  );
}; 