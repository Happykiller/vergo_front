// src/components/TrainingCard.tsx
import React from 'react';
import { Paper, useTheme, BoxProps, PaperProps } from '@mui/material';

interface TrainingCardProps extends PaperProps {
  children: React.ReactNode;
  p?: BoxProps['p'];
  mb?: BoxProps['mb'];
  justifyContent?: BoxProps['justifyContent'];
  alignItems?: BoxProps['alignItems'];
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
