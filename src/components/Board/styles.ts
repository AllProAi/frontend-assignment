import styled from 'styled-components';

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 600px;
  padding: 20px;
`;

export const GameTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
  text-transform: uppercase;
`;

export const GameBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(20, 25px);
  grid-template-columns: repeat(10, 25px);
  gap: 1px;
  border: 2px solid #333;
  background-color: #111;
  padding: 2px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    grid-template-rows: repeat(20, 30px);
    grid-template-columns: repeat(10, 30px);
  }
`;

export const Cell = styled.div<{ filled: boolean; color: string | null }>`
  width: 100%;
  height: 100%;
  background-color: ${props => (props.filled ? props.color : '#222')};
  border: ${props => (props.filled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)')};
  box-sizing: border-box;
`;

export const GameControlsContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StartButton = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #45a049;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const GameStatus = styled.div`
  margin-top: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
`;

export const GameInstructions = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  text-align: center;
`;

export const InstructionItem = styled.div`
  margin: 5px 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const KeyboardKey = styled.span`
  display: inline-block;
  background-color: #e2e2e2;
  border: 1px solid #b4b4b4;
  border-radius: 4px;
  padding: 2px 8px;
  margin: 0 5px;
  font-family: monospace;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  font-weight: bold;
`; 