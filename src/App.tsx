import { createGlobalStyle } from 'styled-components';
import { GameProvider } from './store/gameContext';
import { Board } from './components/Board';
import { LoadingScreen } from './components/LoadingScreen';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }

  body {
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <LoadingScreen />
      <GameProvider>
        <Board />
      </GameProvider>
    </>
  );
}

export default App;
