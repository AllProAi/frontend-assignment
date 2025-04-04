import React, { useState } from 'react';
import styled from 'styled-components';
import { verifyTetrominoDistribution, verifyAllTetrominosGenerated } from '../utils/gameLogic/tetrominoUtils';
import { createNewTetromino } from '../utils/gameLogic/gameHelpers';
import { TETROMINOES } from '../utils/gameLogic/tetrominos';
import { TetrominoShape } from '../models/types';
import { 
  GRID_CONFIG, 
  TIMING_CONFIG, 
  resetToDefaults
} from '../config/gameConfig';

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ToolbarButton = styled.button`
  background-color: #6e45e2;
  color: white;
  border: none;
  padding: 8px 15px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #5833c0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;

const ResultsPanel = styled.div<{ show: boolean }>`
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 15px;
  border-radius: 5px;
  max-width: 350px;
  max-height: 400px;
  overflow: auto;
  margin-top: 10px;
  font-family: monospace;
  font-size: 12px;
  display: ${props => props.show ? 'block' : 'none'};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;

const Badge = styled.span`
  background-color: #ff4081;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
`;

// New styled components for tetromino preview
const TetrominoPreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;
  margin-top: 10px;
`;

const TetrominoCard = styled.div`
  background-color: #222;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TetrominoName = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const TetrominoGrid = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.size}, 1fr)`};
  grid-template-rows: ${props => `repeat(${props.size}, 1fr)`};
  grid-gap: 1px;
  margin: 5px 0;
`;

const TetrominoCell = styled.div<{ filled: boolean; color: string }>`
  width: 15px;
  height: 15px;
  background-color: ${props => props.filled ? props.color : 'transparent'};
  border: 1px solid ${props => props.filled ? props.color : '#444'};
`;

// New styled components for config panel
const ConfigPanelContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 15px;
  border-radius: 5px;
  width: 350px;
  margin-bottom: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
`;

const ConfigTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #6e45e2;
`;

const ConfigSection = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 14px;
  color: #aaa;
`;

const ConfigRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ConfigLabel = styled.label`
  font-size: 13px;
`;

const ConfigInput = styled.input`
  width: 80px;
  background-color: #333;
  border: 1px solid #555;
  border-radius: 3px;
  color: white;
  padding: 4px 8px;
  font-size: 13px;
  &:focus {
    outline: none;
    border-color: #6e45e2;
  }
`;

const ConfigButton = styled.button`
  background-color: #6e45e2;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background-color: #5833c0;
  }
`;

export const DevToolbar: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<string>('');
  const [testCount, setTestCount] = useState(0);
  const [showShapes, setShowShapes] = useState(false);
  
  // Config state
  const [showConfig, setShowConfig] = useState(false);
  const [gridWidth, setGridWidth] = useState(GRID_CONFIG.WIDTH);
  const [gridHeight, setGridHeight] = useState(GRID_CONFIG.HEIGHT);
  const [autoDropInterval, setAutoDropInterval] = useState(TIMING_CONFIG.AUTO_DROP_INTERVAL);
  const [lockDelay, setLockDelay] = useState(TIMING_CONFIG.LOCK_DELAY);

  // Apply configuration changes
  const applyConfigChanges = () => {
    GRID_CONFIG.WIDTH = parseInt(gridWidth.toString());
    GRID_CONFIG.HEIGHT = parseInt(gridHeight.toString());
    TIMING_CONFIG.AUTO_DROP_INTERVAL = parseInt(autoDropInterval.toString());
    TIMING_CONFIG.LOCK_DELAY = parseInt(lockDelay.toString());
    
    console.log('Game configuration updated:');
    console.log('- Grid:', `${GRID_CONFIG.WIDTH}x${GRID_CONFIG.HEIGHT}`);
    console.log('- Auto-drop interval:', `${TIMING_CONFIG.AUTO_DROP_INTERVAL}ms`);
    console.log('- Lock delay:', `${TIMING_CONFIG.LOCK_DELAY}ms`);
    
    // Show confirmation message
    setResults('Configuration updated successfully!\n\nNew configuration:\n' + 
      `- Grid: ${GRID_CONFIG.WIDTH}x${GRID_CONFIG.HEIGHT}\n` +
      `- Auto-drop interval: ${TIMING_CONFIG.AUTO_DROP_INTERVAL}ms\n` +
      `- Lock delay: ${TIMING_CONFIG.LOCK_DELAY}ms\n`
    );
    setShowResults(true);
  };
  
  // Reset to default values
  const handleResetDefaults = () => {
    resetToDefaults();
    
    // Update local state
    setGridWidth(GRID_CONFIG.WIDTH);
    setGridHeight(GRID_CONFIG.HEIGHT);
    setAutoDropInterval(TIMING_CONFIG.AUTO_DROP_INTERVAL);
    setLockDelay(TIMING_CONFIG.LOCK_DELAY);
    
    // Show confirmation
    setResults('Configuration reset to defaults!');
    setShowResults(true);
  };

  const runTetrominoTest = () => {
    // Capture console output
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    
    let output = '=== TETROMINO DISTRIBUTION TEST ===\n\n';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalConsoleLog(...args);
    };
    
    console.warn = (...args) => {
      output += '⚠️ ' + args.join(' ') + '\n';
      originalConsoleWarn(...args);
    };
    
    // Run test with 100 tetrominos
    const distribution = verifyTetrominoDistribution(100);
    
    // Add some visual representation
    output += '\nDistribution Chart:\n';
    Object.entries(distribution).forEach(([type, count]) => {
      const bars = '█'.repeat(Math.round(count / 5));
      output += `${type.padEnd(2)}: ${bars} (${count})\n`;
    });
    
    // Restore console
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    
    // Update state
    setResults(output);
    setShowResults(true);
    setTestCount(prev => prev + 100);
  };
  
  // Add position test
  const testStartPosition = () => {
    const originalConsoleLog = console.log;
    let output = '=== TETROMINO POSITION TEST ===\n\n';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalConsoleLog(...args);
    };
    
    // Test creating 5 tetrominos and verify their positions
    for (let i = 0; i < 5; i++) {
      const tetromino = createNewTetromino();
      const { x, y } = tetromino.position;
      const matrixWidth = tetromino.shape.matrix[0].length;
      const expectedX = 0; // Expected position is top-left (0,0)
      const isCorrect = x === expectedX && y === 0;
      
      output += `Tetromino #${i+1}:\n`;
      output += `  Shape: ${Object.keys(TETROMINOES).find(key => 
        TETROMINOES[key].color === tetromino.shape.color
      )}\n`;
      output += `  Matrix Size: ${tetromino.shape.matrix.length}x${matrixWidth}\n`;
      output += `  Position: (${x}, ${y})\n`;
      output += `  Expected Position: (${expectedX}, 0)\n`;
      output += `  Correct: ${isCorrect ? '✅' : '❌'}\n\n`;
    }
    
    // Restore console
    console.log = originalConsoleLog;
    
    // Update state
    setResults(output);
    setShowResults(true);
  };
  
  // Test the sequence system specifically
  const testSequenceSystem = () => {
    const originalConsoleLog = console.log;
    let output = '=== SEQUENCE SYSTEM TEST ===\n\n';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalConsoleLog(...args);
    };
    
    // Generate a 14-piece sequence (2 complete sets)
    output += "Generating 14 tetrominos (should contain 2 complete sets):\n\n";
    const pieceTypes: Record<string, number> = {};
    const tetrominos = [];
    
    for (let i = 0; i < 14; i++) {
      const tetromino = createNewTetromino();
      const type = Object.keys(TETROMINOES).find(key => 
        TETROMINOES[key].color === tetromino.shape.color
      ) || 'Unknown';
      
      tetrominos.push(type);
      pieceTypes[type] = (pieceTypes[type] || 0) + 1;
    }
    
    // Log all pieces
    for (let i = 0; i < tetrominos.length; i++) {
      output += `Piece ${i+1}: ${tetrominos[i]}\n`;
    }
    
    // Check distribution
    output += "\nDistribution Summary:\n";
    Object.entries(pieceTypes).forEach(([type, count]) => {
      output += `${type}: ${count} pieces\n`;
    });
    
    // Check if we have all 7 types at least once
    const uniqueTypes = Object.keys(pieceTypes).length;
    output += `\nUnique tetromino types: ${uniqueTypes} of 7 expected\n`;
    output += `Each type appears exactly twice: ${Object.values(pieceTypes).every(count => count === 2) ? '✅' : '❌'}\n`;
    
    // Restore console
    console.log = originalConsoleLog;
    
    // Update state
    setResults(output);
    setShowResults(true);
  };

  // Add test to visualize all tetromino shapes
  const showTetrominoShapes = () => {
    setShowShapes(true);
  };

  // Add test to verify all tetromino types
  const testAllTetrominoTypes = () => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    
    let output = '=== ALL TETROMINO TYPES TEST ===\n\n';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalConsoleLog(...args);
    };
    
    console.warn = (...args) => {
      output += '⚠️ ' + args.join(' ') + '\n';
      originalConsoleWarn(...args);
    };
    
    // Run the generation test
    verifyAllTetrominosGenerated();
    
    // Restore console
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    
    // Update state
    setResults(output);
    setShowResults(true);
  };

  // Render a single tetromino for preview
  const renderTetromino = (type: string, shape: TetrominoShape) => {
    const { matrix, color } = shape;
    
    // Determine grid size (maximum dimension)
    const gridSize = Math.max(
      matrix.length,
      ...matrix.map((row: boolean[]) => row.length)
    );
    
    // Create full grid with all cells
    const fullGrid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));
    
    // Fill in the tetromino cells
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (row < gridSize && col < gridSize) {
          fullGrid[row][col] = matrix[row][col];
        }
      }
    }
    
    return (
      <TetrominoCard key={type}>
        <TetrominoName>{type}</TetrominoName>
        <TetrominoGrid size={gridSize}>
          {fullGrid.flatMap((row, rowIndex) => 
            row.map((filled, colIndex) => (
              <TetrominoCell 
                key={`${rowIndex}-${colIndex}`}
                filled={filled}
                color={color}
              />
            ))
          )}
        </TetrominoGrid>
      </TetrominoCard>
    );
  };

  return (
    <ToolbarContainer>
      {/* Config Button */}
      <ToolbarButton onClick={() => setShowConfig(!showConfig)}>
        {showConfig ? 'Hide Config' : 'Show Config'}
      </ToolbarButton>
      
      {/* Configuration Panel */}
      {showConfig && (
        <ConfigPanelContainer>
          <ConfigTitle>Game Configuration</ConfigTitle>
          
          <ConfigSection>
            <SectionTitle>Grid Size</SectionTitle>
            <ConfigRow>
              <ConfigLabel>Width:</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={gridWidth} 
                onChange={(e) => setGridWidth(parseInt(e.target.value))}
                min="5" 
                max="20"
              />
            </ConfigRow>
            <ConfigRow>
              <ConfigLabel>Height:</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={gridHeight} 
                onChange={(e) => setGridHeight(parseInt(e.target.value))}
                min="10" 
                max="30"
              />
            </ConfigRow>
          </ConfigSection>
          
          <ConfigSection>
            <SectionTitle>Timing (ms)</SectionTitle>
            <ConfigRow>
              <ConfigLabel>Auto-drop Interval:</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={autoDropInterval} 
                onChange={(e) => setAutoDropInterval(parseInt(e.target.value))}
                min="100" 
                max="5000"
                step="100"
              />
            </ConfigRow>
            <ConfigRow>
              <ConfigLabel>Lock Delay:</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={lockDelay} 
                onChange={(e) => setLockDelay(parseInt(e.target.value))}
                min="0" 
                max="1000"
                step="50"
              />
            </ConfigRow>
          </ConfigSection>
          
          <ConfigRow>
            <ConfigButton onClick={applyConfigChanges}>Apply Changes</ConfigButton>
            <ConfigButton onClick={handleResetDefaults}>Reset to Defaults</ConfigButton>
          </ConfigRow>
        </ConfigPanelContainer>
      )}
      
      <ToolbarButton onClick={runTetrominoTest}>
        Test Generation
        {testCount > 0 && <Badge>{testCount}</Badge>}
      </ToolbarButton>
      
      <ToolbarButton onClick={testSequenceSystem}>
        Test Sequence
      </ToolbarButton>
      
      <ToolbarButton onClick={testStartPosition}>
        Test Position
      </ToolbarButton>
      
      <ToolbarButton onClick={showTetrominoShapes}>
        Show Shapes
      </ToolbarButton>
      
      <ToolbarButton onClick={testAllTetrominoTypes}>
        Verify All Types
      </ToolbarButton>
      
      {showResults && (
        <ResultsPanel show={showResults}>
          <CloseButton onClick={() => setShowResults(false)}>✕</CloseButton>
          <h3>Test Results</h3>
          <pre>{results}</pre>
        </ResultsPanel>
      )}
      
      {showShapes && (
        <ResultsPanel show={showShapes}>
          <CloseButton onClick={() => setShowShapes(false)}>✕</CloseButton>
          <h3>Tetromino Shapes Preview</h3>
          <TetrominoPreviewContainer>
            {Object.entries(TETROMINOES).map(([type, shape]) => 
              renderTetromino(type, shape)
            )}
          </TetrominoPreviewContainer>
        </ResultsPanel>
      )}
    </ToolbarContainer>
  );
}; 