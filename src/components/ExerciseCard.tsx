// src\components\ExerciseCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, useTheme } from '@mui/material';
import { InfoOutlined, ModeEditOutline } from '@mui/icons-material';
import { Badge, CardContent, IconButton, Tooltip, Typography } from '@mui/material';

import ImageFetcher from '@src/components/ImageFetcher';

interface ExerciseCardProps {
  exercice_id?: string;
  title: string;
  description?: string;
  serie?: number;
  ite?: number;
  weight?: number;
  duration?: number;
  rest?: number;
  pause?: number;
  gender: string;
  img: string;
  onEditClick?: (exercice_id: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercice_id,
  title,
  description,
  serie = 1,
  ite,
  weight,
  duration,
  rest,
  pause,
  gender,
  img,
  onEditClick,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const cardContent = (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: theme.palette.background.default,
        boxShadow: `0 0 24px ${theme.palette.primary.main}33,
           0 0 64px ${theme.palette.primary.main}1A,
           inset 0 0 8px rgba(255, 255, 255, 0.02)`,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        backdropFilter: { xs: 'none', sm: 'blur(2px)' },
      }}
    >
      {/* Image */}
      <ImageFetcher name={`${gender}_${img}`} height={100} width={100} />

      {/* Content */}
      <CardContent>
        <Typography>
          {/* Edit Button */}
          {exercice_id && onEditClick && (
            <IconButton
              size="small"
              title={t('trainings.go_edit')}
              onClick={(e) => {
                e.preventDefault();
                onEditClick(exercice_id);
              }}
            >
              <ModeEditOutline fontSize="small" />
            </IconButton>
          )}
          {/* Info Tooltip */}
          {description && (
            <Tooltip title={description}>
              <IconButton>
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {title}
        </Typography>
        {/* Other Information */}
        <Typography variant="body2">{ite ? `X${ite}` : ''} {weight ? `${weight}kg` : ''}</Typography>
        <Typography variant="body2">{duration ? `Duration: ${duration}s` : ''}</Typography>
        <Typography variant="body2">{rest ? `Rest: ${rest}s` : ''}</Typography>
        <Typography variant="body2">{pause ? `Pause: ${pause}s` : ''}</Typography>
      </CardContent>
    </Paper>
  );

  return serie !== 1 ? (
    <Badge badgeContent={`x${serie}`} color="primary">
      {cardContent}
    </Badge>
  ) : (
    cardContent
  );
};

export default ExerciseCard;
