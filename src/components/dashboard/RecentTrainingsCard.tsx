// src/components/dashboard/RecentTrainingsCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { green, red } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography, List, useTheme, Grid } from '@mui/material';

interface TrainingSession {
  id: string;
  label: string;
  duration: number;
  completed: boolean;
}

interface Props {
  sessions: TrainingSession[];
}

const RecentTrainingsCard: React.FC<Props> = ({ sessions }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `
            0 0 12px ${theme.palette.primary.main}22,
            inset 0 0 8px rgba(255, 255, 255, 0.03)
          `,
        border: `1px solid ${theme.palette.primary.main}33`,
        p: 2,
        mb: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={1}>
        {t('dashboard.recent_trainings')}
      </Typography>
      <List disablePadding>
        {sessions.map((session) => {
          const durationMin = Math.round(session.duration / 60);

          return (
            <Grid
            key={session.id}
            container
            spacing={1}
            sx={{
              py: 1,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Grid size={1}>
              {session.completed ? (
                <CheckCircleIcon sx={{ color: green[500], fontSize: 20 }} />
              ) : (
                <CancelIcon sx={{ color: red[500], fontSize: 20 }} />
              )}
            </Grid>

            <Grid size={8}>
              <Typography variant="body1" noWrap>
                {session.label}
              </Typography>
            </Grid>

            <Grid size={3}>
              <Typography variant="body2" fontWeight="bold">
                {durationMin} min
              </Typography>
            </Grid>
          </Grid>
          );
        })}
      </List>
    </Box>
  );
};

export default RecentTrainingsCard;
