// src\components\training\TrainingTitle.tsx
import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip, IconButton, Typography, TypographyProps } from '@mui/material';

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
