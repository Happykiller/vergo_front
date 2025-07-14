// src/components/training/TrainingFinish.tsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, TypographyProps, useMediaQuery, useTheme } from '@mui/material';

import ImageFetcher from '@components/Image';
import TrainingCard from '@components/TrainingCard';
import { useFullscreen } from '@hooks/useFullscreen';

interface Props {
  gender: 'male' | 'female';
  variant?: TypographyProps['variant'];
}

const TrainingFinish: React.FC<Props> = ({ gender, variant }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { exitFullscreen } = useFullscreen();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const finalVariant: TypographyProps['variant'] = variant ?? (isXs ? 'h4' : 'h2');

  const imageName = gender === 'male' ? 'male_finish' : 'female_finish';

  useEffect(() => {
    exitFullscreen();
  }, [exitFullscreen]);

  return (
    <TrainingCard direction="column" sx={{ alignItems: 'center', gap: 2 }}>
      <ImageFetcher
        name={imageName}
        height={200}
        width={200}
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
