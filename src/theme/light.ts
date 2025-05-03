// src/theme/light.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { customPalette } from './shared';

const baseTheme = createTheme();
const { breakpoints } = baseTheme;
const { pxToRem } = baseTheme.typography;

export const vergoLightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'light',
      ...customPalette,
      background: {
        default: '#FCFCFC',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1C1C1C',
      },
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: ['Montserrat', 'Roboto', 'sans-serif'].join(','),
      h1: {
        fontFamily: 'Montserrat',
        fontWeight: 600,
        fontSize: pxToRem(28),
        lineHeight: 1.4,
        letterSpacing: '0.25px',
        color: '#1C1C1C',
        [breakpoints.up('sm')]: {
          fontSize: pxToRem(32),
        },
        [breakpoints.up('md')]: {
          fontSize: pxToRem(36),
        },
      },
      body1: {
        fontFamily: 'Roboto',
        fontWeight: 400,
        fontSize: pxToRem(15),
        lineHeight: 1.6,
        color: '#1C1C1C',
      },
      button: {
        fontFamily: 'Montserrat',
        fontWeight: 600,
        fontSize: pxToRem(14),
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: '#FCFCFC',
            backgroundImage: `
              radial-gradient(ellipse at 50% 0%, rgba(44, 91, 255, 0.1) 0%, transparent 70%),
              linear-gradient(135deg, #FFFFFF 0%, #F4F6FB 100%)
            `,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'none',
            paddingTop: 12,
            paddingBottom: 12,
          },
          contained: {
            backgroundColor: '#4169E1',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#598AE3',
            },
            '&:disabled': {
              backgroundColor: '#D3D8E2',
              color: '#A0A0A0',
            },
          },
          outlined: {
            borderColor: '#4169E1',
            color: '#4169E1',
            '&:hover': {
              borderColor: '#598AE3',
              color: '#598AE3',
              backgroundColor: 'rgba(89,138,227,0.06)',
            },
          },
        },
      },
    },
  })
);
