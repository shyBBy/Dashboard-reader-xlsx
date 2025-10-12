import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ExcelDataProvider } from './context/ExcelDataContext';
import { MobileViewProvider } from './context/MobileViewContext';
import { ThemeContextProvider } from './context/ThemeContext';
import App from './App';
import './app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <ExcelDataProvider>
          <MobileViewProvider>
            <App />
          </MobileViewProvider>
        </ExcelDataProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
