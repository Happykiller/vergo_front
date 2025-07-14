// src\components\training\TrainingImage.tsx
import React from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';

import ImageFetcher from '@components/Image';

interface Props {
  type: string;
  gender: string;
  image?: string | null;
  slug: string;
  weight?: number;
  ite?: number;
  variant: TypographyProps['variant'];
}

const TrainingImage: React.FC<Props> = ({ type, gender, image, slug, weight, ite, variant }) => {
  if (type === 'pause' || type === 'rest') {
    return (
      <ImageFetcher
        key={`${gender}_rest`}
        name={`${gender}_rest`}
        height={200}
        width={200}
        title={type}
      />
    );
  }

  const src = gender + '_' + (image ?? slug);
  return (
    <Box display="flex" alignItems="center" gap={2}>
      {ite && (
        <Typography variant={variant} align="center" noWrap>
          X{ite}
        </Typography>
      )}
      <ImageFetcher key={src} name={src} height={200} width={200} title={type} />
      {weight && (
        <Typography variant={variant} align="center" noWrap>
          {weight}Kg
        </Typography>
      )}
    </Box>
  );
};

export default TrainingImage;
