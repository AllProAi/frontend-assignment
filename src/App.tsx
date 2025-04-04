import { createGlobalStyle } from 'styled-components';
import { GameProvider } from './store/gameContext';
import { Board } from './components/Board';
import { LoadingScreen } from './components/LoadingScreen';
import { Sidebar } from './components/Sidebar';
import { DevToolsContainer } from './components/DevTools';

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

  /* Add margin to the left side for the sidebar */
  .app-container {
    margin-left: 40px; /* Initial width of closed sidebar */
    transition: margin-left 0.3s ease;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
`;

function App() {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV;
  
  return (
    <>
      <GlobalStyle />
      <LoadingScreen />
      <Sidebar />
      <div className="app-container">
        <GameProvider>
          <Board />
        </GameProvider>
      </div>
      
      {/* Development Tools - only visible in dev mode */}
      {isDev && <DevToolsContainer />}
    </>
  );
}

export default App;
