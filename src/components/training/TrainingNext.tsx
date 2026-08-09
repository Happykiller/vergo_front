// src\components\training\TrainingNext.tsx
import TrainingCard from '@components/TrainingCard';
import { Typography, TypographyProps } from '@mui/material';
import React from 'react';
import { Trans } from 'react-i18next';

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
