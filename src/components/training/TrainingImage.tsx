// src\components\training\TrainingImage.tsx
import { Box, Typography, TypographyProps } from '@mui/material';
import ImageFetcher from '@src/components/ImageFetcher';
import React from 'react';

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
        width={250}
        title={type}
      />
    );
  }

  const src = gender + '_' + (image ?? slug);
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
      }}>
      {ite && (
        <Typography variant={variant} align="center" noWrap>
          X{ite}
        </Typography>
      )}
      <ImageFetcher key={src} name={src} width={250} title={type} />
      {weight && (
        <Typography variant={variant} align="center" noWrap>
          {weight}Kg
        </Typography>
      )}
    </Box>
  );
};

export default TrainingImage;
