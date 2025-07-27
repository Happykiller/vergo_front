// src/components/dashboard/RecentTrainingsCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface Activity {
  date: string;
  duration: number;
}

interface Props {
  activities: Activity[];
}

const formatDay = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'short',
  });
};

const heatmapValues = (activities: any) => activities.map((a: any) => ({
  date: new Date(a.date).toISOString().split('T')[0],
  count: Math.round(a.duration / 60),
}));

const ActivityCard: React.FC<Props> = ({ activities }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const MONTHS_AGO = 6;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - MONTHS_AGO);

  const data = activities.filter((a) => {
    const date = new Date(a.date);
    return date >= startDate && date <= endDate;
  }).map((a) => ({
    name: formatDay(a.date),
    minutes: Math.round(a.duration / 60),
  }));

  const avg = Math.round(data.reduce((acc, d) => acc + d.minutes, 0) / data.length);

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
        {t('dashboard.activity')}
      </Typography>

      <Grid container spacing={2}>
        {/* Left: Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" tick={{ fill: theme.palette.text.primary }} />
                <YAxis hide />
                <Tooltip />
                <Bar
                  dataKey="minutes"
                  fill={theme.palette.primary.main}
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                  isAnimationActive={true}
                  animationDuration={600}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Typography
            variant="caption"
            display="block"
            align="center"
            mt={1}
            sx={{ color: theme.palette.text.secondary }}
          >
            {t('dashboard.average_duration')}: <strong>{avg} min</strong>
          </Typography>
        </Grid>

        {/* Right: Placeholder for other stats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box
              sx={(theme) => ({
                [`& .vg-empty`]: { fill: theme.palette.action.hover },
                [`& .vg-level-1`]: { fill: `${theme.palette.primary.light}AA` },
                [`& .vg-level-2`]: { fill: theme.palette.primary.main },
                [`& .vg-level-3`]: { fill: theme.palette.primary.dark },
                [`& .vg-level-4`]: {
                  fill: theme.palette.primary.dark,
                  stroke: theme.palette.primary.main,
                  strokeWidth: 1,
                },
              })}
            >
              <CalendarHeatmap
                startDate={startDate}
                endDate={new Date()}
                values={heatmapValues(activities)}
                gutterSize={3}
                showWeekdayLabels={true}
                titleForValue={(value) =>
                  value ? `${value.date} – ${value.count} min` : ''
                }
                classForValue={(value) => {
                  if (!value || value.count === 0) return 'vg-empty';
                  if (value.count > 40) return 'vg-level-4';
                  if (value.count > 30) return 'vg-level-3';
                  if (value.count > 15) return 'vg-level-2';
                  return 'vg-level-1';
                }}
              />
              <Typography
                variant="caption"
                display="block"
                align="center"
                mt={1}
                sx={{ color: theme.palette.text.secondary }}
              >
                {t('dashboard.trainings_count')}: <strong>{data.length}</strong>
              </Typography>
            </Box>
          </Box>
        </Grid>

      </Grid>

    </Box>
  );
};

export default ActivityCard;
