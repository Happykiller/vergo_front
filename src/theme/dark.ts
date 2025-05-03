import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { customPalette } from './shared';

const baseTheme = createTheme();
const { breakpoints } = baseTheme;
const { pxToRem } = baseTheme.typography;

export const vergoDarkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      ...customPalette,
      background: {
        default: '#0F0F2B',
        paper: '#1A2E55',
      },
      text: {
        primary: '#F1F1F1',
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
        color: '#F1F1F1',
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
        color: '#F1F1F1',
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
            background: '#0F0F2B',
            backgroundImage: `
              radial-gradient(ellipse at 50% 0%, rgba(44, 91, 255, 0.25) 0%, transparent 70%),
              linear-gradient(135deg, #0F0F2B 0%, #1B1F3B 100%)`,
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
              backgroundColor: '#2D3950',
              color: '#8892A4',
            },
          },
          outlined: {
            borderColor: '#4169E1',
            color: '#4169E1',
            '&:hover': {
              borderColor: '#598AE3',
              color: '#598AE3',
              backgroundColor: 'rgba(89,138,227,0.04)',
            },
          },
        },
      },
    },
  })
);
