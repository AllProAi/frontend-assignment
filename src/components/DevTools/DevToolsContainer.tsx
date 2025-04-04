import React, { useState } from 'react';
import { DevToolbar } from '../DevToolbar';
import { TestUtils } from '../TestUtils';
import styled from 'styled-components';

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

export const DevToolsContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDevTools = () => {
    setIsOpen(!isOpen);
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
        
        <DevToolbar />
        <TestUtils />
      </ToolsContainer>
    </DevToolsWrapper>
  );
}; 