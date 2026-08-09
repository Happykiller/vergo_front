// src/components/TrainingCard.tsx
import React from 'react';
import { Paper, PaperProps, useTheme } from '@mui/material';

interface TrainingCardProps extends PaperProps {
  children: React.ReactNode;
  // MUI 9 a retiré les props système de BoxProps : ces valeurs sont désormais
  // reportées dans le `sx` du Paper, on les type donc directement.
  p?: number | string;
  mb?: number | string;
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  direction?: 'row' | 'column';
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  children,
  p = 1,
  mb = 1,
  justifyContent,
  alignItems,
  direction = 'row', 
  sx,
  ...props
}) => {
  const theme = useTheme();


  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: direction,
        justifyContent: justifyContent ?? (direction === 'row' ? 'center' : 'flex-start'),
        alignItems: alignItems ?? (direction === 'row' ? 'center' : 'stretch'),
        p,
        mb,
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `
          0 0 12px ${theme.palette.primary.main}22,
          inset 0 0 8px rgba(255, 255, 255, 0.03)
        `,
        border: `1px solid ${theme.palette.primary.main}33`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default TrainingCard;
