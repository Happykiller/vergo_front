// src\components\training\TrainingFooter.tsx
import WakeLockComponent from '@components/WakeLock';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import { IconButton, Typography, TypographyProps } from '@mui/material';
import React from 'react';

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
