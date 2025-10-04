import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ExcelDataProvider } from '../app/context/ExcelDataContext';
import { MobileViewProvider } from '../app/context/MobileViewContext';
import { theme } from '../app/theme';
import App from './App';
import '../app/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ExcelDataProvider>
          <MobileViewProvider>
            <App />
          </MobileViewProvider>
        </ExcelDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
