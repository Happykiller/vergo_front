import React from 'react';
import { useTheme, useMediaQuery, Typography } from '@mui/material';

const CurrentBreakpoint = () => {
  const theme = useTheme();

  // Vérification des points de rupture de MUI
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  // Déterminer quel breakpoint est actif
  let currentBreakpoint = 'xs';
  if (isSm) currentBreakpoint = 'sm';
  if (isMd) currentBreakpoint = 'md';
  if (isLg) currentBreakpoint = 'lg';
  if (isXl) currentBreakpoint = 'xl';

  return (
    <Typography variant="h6">
      Current Breakpoint: {currentBreakpoint}
    </Typography>
  );
};

export default CurrentBreakpoint;