import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { runTetrominoGenerationTest, verifyTetrominoDistribution } from '../utils/gameLogic/tetrominoUtils';

const TestContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  z-index: 1000;
  max-width: 400px;
  max-height: 300px;
  overflow: auto;
`;

const Button = styled.button`
  background-color: #6e45e2;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #5833c0;
  }
`;

const TestResults = styled.pre`
  margin-top: 10px;
  font-size: 11px;
  white-space: pre-wrap;
`;

export const TestUtils: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [results, setResults] = useState<string>('');
  const [generationCount, setGenerationCount] = useState(0);
  
  useEffect(() => {
    // Add a keyboard shortcut to toggle the test panel (Ctrl+Shift+T)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        setVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Test tetromino generation
  const testTetrominoGeneration = () => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    
    let testOutput = '';
    
    // Override console.log/warn to capture output
    console.log = (...args) => {
      testOutput += args.join(' ') + '\n';
    };
    console.warn = (...args) => {
      testOutput += '⚠️ ' + args.join(' ') + '\n';
    };
    
    // Run test with 100 iterations
    const distribution = verifyTetrominoDistribution(100);
    
    // Add some visual representation
    testOutput += '\nDistribution Chart:\n';
    Object.entries(distribution).forEach(([type, count]) => {
      const bars = '█'.repeat(Math.round(count / 5));
      testOutput += `${type.padEnd(2)}: ${bars} (${count})\n`;
    });
    
    // Restore console
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    
    // Update state
    setResults(testOutput);
    setGenerationCount(prev => prev + 100);
  };
  
  if (!visible) return null;
  
  return (
    <TestContainer>
      <div>
        <h3>Tetromino Test Utils</h3>
        <Button onClick={testTetrominoGeneration}>
          Test Random Generation (100 tetrominos)
        </Button>
        <span>Total generated: {generationCount}</span>
      </div>
      
      {results && (
        <TestResults>
          {results}
        </TestResults>
      )}
    </TestContainer>
  );
}; 