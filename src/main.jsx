import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApiDataProvider } from './context/ApiDataContext';
import { MobileViewProvider } from './context/MobileViewContext';
import { ThemeContextProvider } from './context/ThemeContext';
import App from './App';
import './app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <ApiDataProvider>
          <MobileViewProvider>
            <App />
          </MobileViewProvider>
        </ApiDataProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
