import { createTheme } from '@mui/material/styles';

// Fonction pour créer un thème en fonction du mode
const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

export default getTheme;
