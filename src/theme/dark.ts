// src\theme\dark.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import {
  createSharedComponents,
  sharedShape,
  sharedTypography,
} from './shared';

const palette = {
  mode: 'dark' as const,
  primary: { main: '#4169E1', light: '#598AE3' },
  secondary: { main: '#8ECAE6', light: '#B2E4F3' },
  background: {
    default: '#0F0F2B',
    paper: '#1A2E55',
  },
  text: {
    primary: '#F1F1F1',
  },
  gradient: `
    radial-gradient(ellipse at 50% 0%, rgba(44, 91, 255, 0.25) 0%, transparent 70%),
    linear-gradient(135deg, #0F0F2B 0%, #1B1F3B 100%)`,
};

export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: palette,
    shape: sharedShape,
    typography: sharedTypography,
    components: {
      ...createSharedComponents(palette.primary),
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            fontFamily: sharedTypography.fontFamily,
          },
          body: {
            fontFamily: sharedTypography.fontFamily,
            backgroundColor: palette.background.default,
            backgroundImage: palette.gradient,
            color: palette.text.primary,
            margin: 0,
          },
        },
      },
    },
  })
);