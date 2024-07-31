import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Switch, FormControlLabel } from '@mui/material';
import App from './App';
import './i18n';
import getTheme from './theme';  // Importez la fonction de création de thème

const Index: React.FC = () => {
  const [darkMode] = useState(true);

  // Créez le thème en fonction du mode
  const theme = getTheme(darkMode ? 'dark' : 'light');

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Router>
  );
};

// Créez une racine avec ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Index />);
