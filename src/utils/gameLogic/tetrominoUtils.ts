import { TetrominoShape } from '../../models/types';
import { getRandomTetromino, TETROMINOES } from './tetrominos';

// Track distribution of generated tetrominos
const distributionTracker: Record<string, number> = {
  I: 0, J: 0, L: 0, O: 0, S: 0, T: 0, Z: 0
};

// Reset the distribution tracker
const resetTracker = () => {
  Object.keys(distributionTracker).forEach(key => {
    distributionTracker[key] = 0;
  });
};

// Function to verify tetromino distribution
export const verifyTetrominoDistribution = (iterations: number = 700): Record<string, number> => {
  // Reset tracker
  resetTracker();
  
  // Generate tetrominos and track distribution
  for (let i = 0; i < iterations; i++) {
    const tetromino = getRandomTetromino();
    
    // Find which tetromino type was generated
    const tetrominoType = Object.entries(TETROMINOES).find(
      ([, shape]) => shape.color === tetromino.color
    );
    
    if (tetrominoType) {
      distributionTracker[tetrominoType[0]]++;
    }
  }
  
  // Calculate expected distribution
  const totalTypes = Object.keys(distributionTracker).length;
  const expectedPerType = iterations / totalTypes;
  const tolerance = 0.1; // Allow 10% deviation from expected
  
  // Log results
  console.log('Tetromino distribution analysis:');
  console.log('--------------------------------');
  Object.entries(distributionTracker).forEach(([type, count]) => {
    const percentage = (count / iterations * 100).toFixed(2);
    const deviation = ((count - expectedPerType) / expectedPerType * 100).toFixed(2);
    const deviationStr = count > expectedPerType ? `+${deviation}%` : `${deviation}%`;
    
    console.log(`${type}: ${count} (${percentage}%) [${deviationStr} from expected]`);
  });
  
  // Check if distribution is reasonably even (for our 7-bag system, it should be very even)
  let isEvenDistribution = true;
  let bagSize = 7; // Tetris uses 7-bag system
  
  // Special check for multiples of bag size
  if (iterations % bagSize === 0) {
    // If we've drawn complete bags, distribution should be perfectly even
    const perfectCount = iterations / bagSize;
    
    Object.entries(distributionTracker).forEach(([type, count]) => {
      if (count !== perfectCount) {
        console.warn(`Warning: ${type} tetromino count (${count}) should be exactly ${perfectCount} with complete bags!`);
        isEvenDistribution = false;
      }
    });
    
    if (isEvenDistribution) {
      console.log('✅ Perfect distribution achieved with complete bags!');
    }
  } else {
    // Otherwise check with tolerance
    Object.entries(distributionTracker).forEach(([type, count]) => {
      const deviation = Math.abs(count - expectedPerType) / expectedPerType;
      if (deviation > tolerance) {
        console.warn(`Warning: ${type} tetromino distribution deviates by ${(deviation * 100).toFixed(2)}% from expected`);
        isEvenDistribution = false;
      }
    });
    
    if (isEvenDistribution) {
      console.log('✅ Tetromino distribution appears to be sufficiently random');
    } else {
      console.warn('⚠️ Tetromino distribution shows possible bias');
    }
  }
  
  return distributionTracker;
};

// Function to test perfect bag distribution with multiples of 7
export const testPerfectDistribution = (): Record<string, number> => {
  const numberOfBags = 10; // Test with 10 complete bags
  const iterations = numberOfBags * 7; // 7 tetrominos per bag
  
  console.log(`Testing distribution with ${numberOfBags} complete bags (${iterations} tetrominos)...`);
  return verifyTetrominoDistribution(iterations);
};

// Function to test random generation for 100 tetrominos
export const runTetrominoGenerationTest = (): void => {
  verifyTetrominoDistribution(100);
};

// Function to verify that all tetromino types are being properly generated
export const verifyAllTetrominosGenerated = (): void => {
  console.log('Testing generation of all tetromino types:');
  console.log('----------------------------------------');
  
  // Track which tetrominos have been generated
  const generatedTypes = new Set<string>();
  const maxAttempts = 100; // Safety limit
  let attempts = 0;
  
  // Generate tetrominos until we've seen all types or hit max attempts
  while (generatedTypes.size < Object.keys(TETROMINOES).length && attempts < maxAttempts) {
    attempts++;
    const tetromino = getRandomTetromino();
    
    // Find which type this tetromino is
    const tetrominoType = Object.entries(TETROMINOES).find(
      ([, shape]) => shape.color === tetromino.color
    );
    
    if (tetrominoType) {
      if (!generatedTypes.has(tetrominoType[0])) {
        console.log(`✅ Generated tetromino type: ${tetrominoType[0]}`);
        generatedTypes.add(tetrominoType[0]);
      }
    }
  }
  
  // Check if all types were generated
  if (generatedTypes.size === Object.keys(TETROMINOES).length) {
    console.log('\n✅ SUCCESS: All tetromino types were successfully generated!');
  } else {
    console.warn(`\n⚠️ WARNING: Only ${generatedTypes.size} out of ${Object.keys(TETROMINOES).length} tetromino types were generated.`);
    
    // List missing types
    const missingTypes = Object.keys(TETROMINOES).filter(type => !generatedTypes.has(type));
    console.warn('Missing types:', missingTypes.join(', '));
  }
}; 