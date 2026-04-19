// src\components\training\TrainingFinish.tsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, TypographyProps, useMediaQuery, useTheme } from '@mui/material';

import TrainingCard from '@components/TrainingCard';
import ImageFetcher from '@components/ImageFetcher';

interface Props {
  gender: 'male' | 'female';
  variant?: TypographyProps['variant'];
  onFinish?: () => void;
}

const TrainingFinish: React.FC<Props> = ({ gender, variant, onFinish }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const finalVariant: TypographyProps['variant'] = variant ?? (isXs ? 'h4' : 'h2');

  const imageName = gender === 'male' ? 'male_finish' : 'female_finish';

  useEffect(() => {
    if (onFinish) {
      onFinish();
    }
  }, [onFinish]);

  return (
    <TrainingCard direction="column" sx={{ alignItems: 'center', gap: 2 }}>
      <ImageFetcher
        name={imageName}
        width={250}
        title={t('training.finished')}
      />
      <Typography
        variant={finalVariant}
        align="center"
        color="primary"
        noWrap
      >
        {t('training.finished')}
      </Typography>
    </TrainingCard>
  );
};

export default TrainingFinish;
