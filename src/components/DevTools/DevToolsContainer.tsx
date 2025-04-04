import React, { useState } from 'react';
import { DevToolbar } from '../DevToolbar';
import { TestUtils } from '../TestUtils';
import styled from 'styled-components';
import { GRID_CONFIG, TIMING_CONFIG, TETROMINO_CONFIG, resetToDefaults } from '../../config/gameConfig';

const DevToolsWrapper = styled.div`
  position: fixed;
  right: 10px;
  top: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CollapsedButton = styled.button`
  background-color: #6e45e2;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  margin-bottom: 10px;
  
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

const ToolsContainer = styled.div<{ isOpen: boolean }>`
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s;
  background-color: rgba(34, 34, 34, 0.85);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(110, 69, 226, 0.3);
  max-height: ${props => (props.isOpen ? '80vh' : '0')};
  overflow: auto;
  width: 420px;
`;

const DevToolsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DevToolsTitle = styled.h2`
  color: #6e45e2;
  font-size: 18px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;

// Configuration panel components
const ConfigSection = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
`;

interface ConfigHeaderProps {
  expanded?: boolean;
}

const ConfigHeader = styled.div<ConfigHeaderProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: ${props => props.expanded ? '15px' : '0'};
`;

const ConfigTitle = styled.h3`
  color: #6e45e2;
  font-size: 16px;
  margin: 0;
`;

const ConfigContent = styled.div<{ expanded: boolean }>`
  display: ${props => props.expanded ? 'block' : 'none'};
`;

const ConfigItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ConfigLabel = styled.label`
  color: white;
  font-size: 14px;
`;

const ConfigInput = styled.input`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 6px 10px;
  width: 80px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #6e45e2;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #6e45e2;
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const ConfigButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const ConfigButton = styled.button`
  background-color: #6e45e2;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #5833c0;
  }
`;

export const DevToolsContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  
  // Game configuration state
  const [gridWidth, setGridWidth] = useState(GRID_CONFIG.WIDTH);
  const [gridHeight, setGridHeight] = useState(GRID_CONFIG.HEIGHT);
  const [dropInterval, setDropInterval] = useState(TIMING_CONFIG.AUTO_DROP_INTERVAL);
  const [lockDelay, setLockDelay] = useState(TIMING_CONFIG.LOCK_DELAY);
  const [queueSize, setQueueSize] = useState(TETROMINO_CONFIG.QUEUE_SIZE);

  const toggleDevTools = () => {
    setIsOpen(!isOpen);
  };
  
  const applyConfig = () => {
    GRID_CONFIG.WIDTH = parseInt(gridWidth.toString());
    GRID_CONFIG.HEIGHT = parseInt(gridHeight.toString());
    TIMING_CONFIG.AUTO_DROP_INTERVAL = parseInt(dropInterval.toString());
    TIMING_CONFIG.LOCK_DELAY = parseInt(lockDelay.toString());
    TETROMINO_CONFIG.QUEUE_SIZE = parseInt(queueSize.toString());
    
    console.log('Game configuration updated:');
    console.log(`- Grid: ${GRID_CONFIG.WIDTH}x${GRID_CONFIG.HEIGHT}`);
    console.log(`- Drop interval: ${TIMING_CONFIG.AUTO_DROP_INTERVAL}ms`);
    console.log(`- Lock delay: ${TIMING_CONFIG.LOCK_DELAY}ms`);
    console.log(`- Tetromino queue size: ${TETROMINO_CONFIG.QUEUE_SIZE}`);
    
    // Show notification
    alert('Configuration applied! Start a new game to see changes.');
  };
  
  const resetConfig = () => {
    resetToDefaults();
    
    // Update state
    setGridWidth(GRID_CONFIG.WIDTH);
    setGridHeight(GRID_CONFIG.HEIGHT);
    setDropInterval(TIMING_CONFIG.AUTO_DROP_INTERVAL);
    setLockDelay(TIMING_CONFIG.LOCK_DELAY);
    setQueueSize(TETROMINO_CONFIG.QUEUE_SIZE);
    
    console.log('Configuration reset to defaults');
    
    // Show notification
    alert('Configuration reset to defaults!');
  };

  return (
    <DevToolsWrapper>
      <CollapsedButton onClick={toggleDevTools}>
        {isOpen ? 'Hide Developer Tools' : 'Show Developer Tools'}
      </CollapsedButton>
      
      <ToolsContainer isOpen={isOpen}>
        <DevToolsHeader>
          <DevToolsTitle>NOVUS | NEXUM Developer Tools</DevToolsTitle>
          <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
        </DevToolsHeader>
        
        {/* Game Configuration Section */}
        <ConfigSection>
          <ConfigHeader onClick={() => setShowConfig(!showConfig)}>
            <ConfigTitle>Game Configuration</ConfigTitle>
            <span>{showConfig ? '▲' : '▼'}</span>
          </ConfigHeader>
          
          <ConfigContent expanded={showConfig}>
            <ConfigItem>
              <ConfigLabel>Grid Width:</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={gridWidth} 
                onChange={(e) => setGridWidth(parseInt(e.target.value))}
                min="5"
                max="20"
              />
            </ConfigItem>
            
            <ConfigItem>
              <ConfigLabel>Grid Height:</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={gridHeight} 
                onChange={(e) => setGridHeight(parseInt(e.target.value))}
                min="10"
                max="40"
              />
            </ConfigItem>
            
            <ConfigItem>
              <ConfigLabel>Auto-Drop Interval (ms):</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={dropInterval} 
                onChange={(e) => setDropInterval(parseInt(e.target.value))}
                min="100"
                max="2000"
                step="100"
              />
            </ConfigItem>
            
            <ConfigItem>
              <ConfigLabel>Lock Delay (ms):</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={lockDelay} 
                onChange={(e) => setLockDelay(parseInt(e.target.value))}
                min="0"
                max="1000"
                step="50"
              />
            </ConfigItem>
            
            <ConfigItem>
              <ConfigLabel>Tetromino Queue Size:</ConfigLabel>
              <ConfigInput 
                type="number" 
                value={queueSize} 
                onChange={(e) => setQueueSize(parseInt(e.target.value))}
                min="7"
                max="28"
                step="7"
              />
            </ConfigItem>
            
            <ConfigButtonGroup>
              <ConfigButton onClick={applyConfig}>Apply Changes</ConfigButton>
              <ConfigButton onClick={resetConfig}>Reset to Defaults</ConfigButton>
            </ConfigButtonGroup>
          </ConfigContent>
        </ConfigSection>
        
        <DevToolbar />
        <TestUtils />
      </ToolsContainer>
    </DevToolsWrapper>
  );
}; 