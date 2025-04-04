import { TetrominoShape } from '../../models/types';
import { TETROMINO_CONFIG, TETROMINOES as CONFIG_TETROMINOES } from '../../config/gameConfig';

// Re-export the config for backward compatibility
export const TETROMINOES: Record<string, TetrominoShape> = CONFIG_TETROMINOES;

// Create a fresh bag with all 7 tetromino types
function createShuffledBag(): string[] {
  const bag = Object.keys(TETROMINOES);
  
  // Fisher-Yates shuffle algorithm
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  
  console.log('New bag created:', bag.join(', '));
  return bag;
}

// Get a truly random tetromino (can repeat)
function getTrulyRandomTetromino(): TetrominoShape {
  const keys = Object.keys(TETROMINOES);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  
  console.log(`Generated tetromino (truly random): ${randomKey}`);
  return TETROMINOES[randomKey];
}

// Export the getRandomTetromino function that uses the selected method
export const getRandomTetromino = (): TetrominoShape => {
  if (TETROMINO_CONFIG.USE_FRESH_BAG_EACH_TIME) {
    // Create a fresh bag each time
    const bag = createShuffledBag();
    
    // Always take the first piece from the bag
    const piece = bag[0];
    
    console.log(`Generated tetromino (from fresh bag): ${piece}`);
    return TETROMINOES[piece];
  } else {
    // Use truly random generation
    return getTrulyRandomTetromino();
  }
}; 