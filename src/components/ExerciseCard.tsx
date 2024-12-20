import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { Badge, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';

import ImageFetcher from '@components/Image';

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
  const cardContent = (
    <Card sx={{ backgroundColor: '#333' }}>
      {/* Image */}
      <ImageFetcher name={`${gender}_${img}`} height={100} width={100} />

      {/* Content */}
      <CardContent>
        <Typography>
          {/* Edit Button */}
          {exercice_id && onEditClick && (
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                onEditClick(exercice_id);
              }}
            >
              <EditIcon />
            </IconButton>
          )}
          {/* Info Tooltip */}
          {description && (
            <Tooltip title={description}>
              <IconButton>
                <InfoIcon />
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
    </Card>
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
