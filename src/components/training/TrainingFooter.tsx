// src\components\training\TrainingFooter.tsx
import React from 'react';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import { Typography, IconButton, TypographyProps } from '@mui/material';

import WakeLockComponent from '@components/WakeLock';

interface Props {
  variant: TypographyProps['variant'];
  formattedDuration: string;
  endTime: string;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const TrainingFooter: React.FC<Props> = ({ variant, formattedDuration, endTime, isFullscreen, toggleFullscreen }) => (
  <>
    <WakeLockComponent />
    <Typography variant={variant} align="center" color="primary" noWrap>
      {`${formattedDuration} | ${endTime}`}
    </Typography>
    <IconButton onClick={toggleFullscreen} aria-label="toggle fullscreen">
      {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
    </IconButton>
  </>
);

export default TrainingFooter;
