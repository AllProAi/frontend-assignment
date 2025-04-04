import { TetrominoShape } from '../../models/types';
import { TETROMINO_CONFIG } from '../../config/gameConfig';

// Define tetromino shapes and colors according to the standard configuration
export const TETROMINOES: Record<string, TetrominoShape> = {
  // O (yellow square) - 2x2
  O: { 
    matrix: [
      [true, true], 
      [true, true]
    ], 
    color: '#FFFF00' // Yellow
  },
  
  // I (cyan line) - 4x1
  I: { 
    matrix: [
      [true],
      [true],
      [true],
      [true]
    ], 
    color: '#00FFFF' // Cyan
  },
  
  // S (red S shape)
  S: { 
    matrix: [
      [false, true, true], 
      [true, true, false]
    ], 
    color: '#FF0000' // Red
  },
  
  // Z (green Z shape)
  Z: { 
    matrix: [
      [true, true, false], 
      [false, true, true]
    ], 
    color: '#00FF00' // Green
  },
  
  // L (orange L shape)
  L: { 
    matrix: [
      [true, false], 
      [true, false], 
      [true, true]
    ], 
    color: '#FF7F00' // Orange
  },
  
  // J (pink J shape)
  J: { 
    matrix: [
      [false, true], 
      [false, true], 
      [true, true]
    ], 
    color: '#FF00FF' // Pink
  },
  
  // T (purple T shape)
  T: { 
    matrix: [
      [true, true, true], 
      [false, true, false]
    ], 
    color: '#800080' // Purple
  }
};

// More robust random number generator
class CustomRandom {
  private static instance: CustomRandom;
  private history: string[] = [];
  private s1 = Math.random() * 0xFFFFFFFF;
  private s2 = Math.random() * 0xFFFFFFFF;
  private s3 = Math.random() * 0xFFFFFFFF;
  private startTime = Date.now();
  private callCount = 0;

  // Private constructor for singleton
  private constructor() {
    this.reseed();
  }

  // Get the singleton instance
  public static getInstance(): CustomRandom {
    if (!CustomRandom.instance) {
      CustomRandom.instance = new CustomRandom();
    }
    return CustomRandom.instance;
  }

  // Xorshift algorithm - better than Math.random()
  private xorshift(): number {
    let t = this.s1 ^ (this.s1 << 11);
    this.s1 = this.s2;
    this.s2 = this.s3;
    this.s3 = (this.s3 ^ (this.s3 >> 19) ^ t ^ (t >> 8));
    return (this.s3 / 0xFFFFFFFF + 0.5); // Normalize to 0-1
  }

  // Reseed with multiple entropy sources
  private reseed(): void {
    const now = Date.now();
    const timeDiff = now - this.startTime;
    
    // Mix in current time, performance metrics if available, and call count
    this.s1 = ((now % 65521) * 3.14159) ^ (this.callCount * 7919);
    this.s2 = ((timeDiff % 65521) * 2.71828) ^ (this.s1 * 104729);
    this.s3 = (((now & 0xFFFF) | (timeDiff << 16)) * 1.61803) ^ (this.s2 * 15485863);
    
    // Extra entropy from multiple random calls
    for (let i = 0; i < 10; i++) {
      this.s1 ^= Math.floor(Math.random() * 0xFFFFFFFF);
      this.s2 ^= Math.floor(Math.random() * 0xFFFFFFFF);
      this.s3 ^= Math.floor(Math.random() * 0xFFFFFFFF);
    }
  }

  // Get random number between 0-1
  public random(): number {
    this.callCount++;
    
    // Periodically reseed for better entropy
    if (this.callCount % 50 === 0) {
      this.reseed();
    }
    
    return this.xorshift();
  }

  // Get random integer in range [min, max) 
  public randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min)) + min;
  }

  // Get random item from array
  public randomItem<T>(array: T[]): T {
    return array[this.randomInt(0, array.length)];
  }

  // Add item to history and get a different one
  public randomItemWithHistory<T>(array: T[], maxHistory: number = 3): T {
    // Keep history length in check
    if (this.history.length > maxHistory) {
      this.history = this.history.slice(-maxHistory);
    }

    // If we've seen all items recently, reset history
    if (this.history.length >= array.length) {
      this.history = this.history.slice(-1);
    }

    // Filter out recent items
    const availableItems = array.filter(item => !this.history.includes(String(item)));
    
    // If everything is filtered out, just pick a random one that's not the most recent
    const mostRecent = this.history[this.history.length - 1];
    const selection = availableItems.length > 0 
      ? this.randomItem(availableItems)
      : this.randomItem(array.filter(item => String(item) !== mostRecent));
    
    // Add to history
    this.history.push(String(selection));
    
    return selection;
  }
}

// All tetromino types in an array for easy access
const TETROMINO_TYPES = Object.keys(TETROMINOES);

// NEW IMPLEMENTATION: Ultra-Robust Random System
export function getRandomTetromino(): TetrominoShape {
  // Get our custom random generator
  const rng = CustomRandom.getInstance();
  
  // Get a random tetromino type with history tracking to avoid patterns
  const selectedType = rng.randomItemWithHistory(TETROMINO_TYPES, 4);
  
  // Return the corresponding tetromino shape
  return TETROMINOES[selectedType];
}

// Legacy compatibility methods - now they all use the new system
export const getTrulyRandomTetromino = getRandomTetromino;
export const getNextTetrominoFromBag = getRandomTetromino;
export function getNextTetromino(): TetrominoShape {
  return getRandomTetromino();
}; 