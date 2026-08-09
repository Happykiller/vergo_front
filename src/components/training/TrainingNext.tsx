// src\components\training\TrainingNext.tsx
import React from 'react';
import { Trans } from 'react-i18next';
import { Typography, TypographyProps } from '@mui/material';

import TrainingCard from '@components/TrainingCard';

interface Props {
  type: string;
  variant: TypographyProps['variant'];
  nextTitles: React.ReactNode[];
}

const TrainingNext: React.FC<Props> = ({ type, variant, nextTitles }) => {
  if (type === 'effort') {
    return (
      <TrainingCard direction="column" sx={{ justifyContent: 'center', alignItems: 'center' }}>
        {nextTitles}
      </TrainingCard>
    );
  }

  return (
    <TrainingCard>
      <Typography variant={variant} align="center" color="primary" noWrap>
        <Trans>training.{type}</Trans>
      </Typography>
    </TrainingCard>
  );
};

export default TrainingNext;
