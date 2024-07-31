import { createTheme } from '@mui/material/styles';

// Function to create a theme based on the mode ('light' or 'dark')
const getTheme = (mode: 'light' | 'dark') => createTheme({
  // Define the theme palette based on the provided mode
  palette: {
    // Set the color mode for the palette
    mode,
    
    // Define primary color scheme
    primary: {
      // Main color for primary elements
      main: '#90caf9',  // Light blue color
    },
    
    // Define secondary color scheme
    secondary: {
      // Main color for secondary elements
      main: '#f48fb1',  // Light pink color
    },
  },
});

export default getTheme;
