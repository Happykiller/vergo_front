// src/theme/light.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import {
  createSharedComponents,
  sharedShape,
  sharedTypography,
} from './shared';

const palette = {
  mode: 'light' as const,
  primary: { main: '#4169E1', light: '#598AE3' },
  secondary: { main: '#8ECAE6', light: '#B2E4F3' },
  background: {
    default: '#FCFCFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1C1C1C',
  },
  gradient: `
    radial-gradient(ellipse at 50% 0%, rgba(44, 91, 255, 0.1) 0%, transparent 70%),
    linear-gradient(135deg, #FFFFFF 0%, #F4F6FB 100%)`,
};

export const lightTheme = responsiveFontSizes(
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