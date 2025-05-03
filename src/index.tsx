import React, { createContext, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import App from './App';
import initI18n from './i18n';

import '@fontsource/montserrat/600.css';
import '@fontsource/roboto/400.css';
import '@fontsource/montserrat';
import '@fontsource/roboto';
import { getVergoTheme, ThemeMode } from './theme';

import { IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

export const ThemeModeContext = createContext<{
  mode: ThemeMode;
  toggleTheme: () => void;
}>({ mode: 'dark', toggleTheme: () => { } });

const Index: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const theme = useMemo(() => getVergoTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      {/* Provide the theme to the entire application */}
      <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 16,
              zIndex: 1300,
              p: 1,
            }}
          >
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                color: theme => theme.palette.secondary.main,
                '&:hover': {
                  color: theme => theme.palette.secondary.light,
                },
              }}
            >
              {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
          {/* Apply CSS baseline to ensure consistent styling across browsers */}
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </Router>
  );
};

// Initialize i18n and then render the app
initI18n().then(() => {
  // Create a root for rendering with ReactDOM.createRoot
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  // Render the Index component into the root element
  root.render(<Index />);
});
