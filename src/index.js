import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SocketContext, socket } from './context/ContextSocketIO';
import { StrictMode } from 'react';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>,
  </StrictMode>
);