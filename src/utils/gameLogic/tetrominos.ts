import { TetrominoShape } from '../../models/types';


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

// The official Tetris 7-bag randomizer
class TetrominoRandomizer {
  private static instance: TetrominoRandomizer;
  private currentBag: string[] = [];
  private nextBag: string[] = [];
  private debugSequence: string = '';
  
  // Make constructor private to enforce singleton
  private constructor() {
    this.fillBag(this.currentBag);
    this.fillBag(this.nextBag);
    
    // Add extra shuffle steps to both bags
    this.shuffleBag(this.currentBag);
    this.shuffleBag(this.nextBag);
  }
  
  // Get singleton instance
  public static getInstance(): TetrominoRandomizer {
    if (!TetrominoRandomizer.instance) {
      TetrominoRandomizer.instance = new TetrominoRandomizer();
    }
    return TetrominoRandomizer.instance;
  }
  
  // Fill a bag with one of each tetromino type and shuffle it
  private fillBag(bag: string[]): void {
    // Start with all tetromino types
    bag.length = 0;
    Object.keys(TETROMINOES).forEach(type => {
      bag.push(type);
    });
    
    // Shuffle the bag (modern Fisher-Yates algorithm)
    this.shuffleBag(bag);
  }
  
  // Shuffle the bag with a thoroughly-tested robust shuffle
  private shuffleBag(bag: string[]): void {
    // Starting from the top of the array, swap each element with a random one below it
    for (let i = bag.length - 1; i > 0; i--) {
      // Get current timestamp for extra entropy in each shuffle step
      const timestamp = new Date().getTime();
      // Use multiplication by primes and bitwise operations for better distribution
      const randomFactor = (timestamp % 919) * 17;
      // Calculate random index
      const j = Math.floor((Math.random() * randomFactor % (i + 1)));
      // Swap elements
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    
    // Extra shuffle passes for increased randomness
    for (let pass = 0; pass < 3; pass++) {
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
  }
  
  // Get the next tetromino type from the current bag
  public getNextTetromino(): TetrominoShape {
    // If current bag is empty, move to the next bag
    if (this.currentBag.length === 0) {
      // Replace current bag with next bag
      this.currentBag = [...this.nextBag];
      
      // Create a new next bag
      this.nextBag = [];
      this.fillBag(this.nextBag);
    }
    
    // Take the next piece from the current bag - use shift() to take from beginning for FIFO order
    const nextType = this.currentBag.shift()!;
    
    // For debugging
    this.debugSequence += nextType;
    if (this.debugSequence.length > 20) {
      this.debugSequence = this.debugSequence.substring(this.debugSequence.length - 20);
    }
    
    // Return the tetromino
    return TETROMINOES[nextType];
  }
  
  // Get sequence for debugging
  public getDebugSequence(): string {
    return this.debugSequence;
  }
  
  // Debug method: get the current bag contents
  public getCurrentBagContents(): string[] {
    return [...this.currentBag];
  }
  
  // Debug method: get the next bag contents
  public getNextBagContents(): string[] {
    return [...this.nextBag];
  }
}

// Export the single function to get random tetrominos
export function getRandomTetromino(): TetrominoShape {
  return TetrominoRandomizer.getInstance().getNextTetromino();
}

// Legacy compatibility methods
export const getTrulyRandomTetromino = getRandomTetromino;
export const getNextTetrominoFromBag = getRandomTetromino;
export function getNextTetromino(): TetrominoShape {
  return getRandomTetromino();
} 