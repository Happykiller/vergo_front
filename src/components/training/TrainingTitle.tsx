// src\components\training\TrainingTitle.tsx
import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Tooltip, Typography, TypographyProps } from '@mui/material';
import React from 'react';

interface Props {
  title: string;
  description?: string;
  variant: TypographyProps['variant'];
}

const TrainingTitle: React.FC<Props> = ({ title, description, variant }) => (
  <Typography variant={variant} align="center" noWrap>
    {description && (
      <Tooltip title={description}>
        <IconButton aria-label="info">
          <InfoIcon />
        </IconButton>
      </Tooltip>
    )}
    {title}
  </Typography>
);

export default TrainingTitle;
