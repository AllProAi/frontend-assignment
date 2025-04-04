import { TetrominoShape } from '../../models/types';

export const TETROMINOES: Record<string, TetrominoShape> = {
  I: {
    matrix: [
      [true, true, true, true]
    ],
    color: '#00FFFF' // Cyan
  },
  J: {
    matrix: [
      [true, false, false],
      [true, true, true]
    ],
    color: '#0000FF' // Blue
  },
  L: {
    matrix: [
      [false, false, true],
      [true, true, true]
    ],
    color: '#FF7F00' // Orange
  },
  O: {
    matrix: [
      [true, true],
      [true, true]
    ],
    color: '#FFFF00' // Yellow
  },
  S: {
    matrix: [
      [false, true, true],
      [true, true, false]
    ],
    color: '#00FF00' // Green
  },
  T: {
    matrix: [
      [false, true, false],
      [true, true, true]
    ],
    color: '#800080' // Purple
  },
  Z: {
    matrix: [
      [true, true, false],
      [false, true, true]
    ],
    color: '#FF0000' // Red
  }
};

export const getRandomTetromino = (): TetrominoShape => {
  const keys = Object.keys(TETROMINOES);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOES[randomKey];
}; 