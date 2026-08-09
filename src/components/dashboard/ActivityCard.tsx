import React, { useMemo } from 'react';
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
import { KpisVolumeDashbardUsecaseModel } from '@usecases/dashboard/model/kpis.volume.dashboard.usecase.model';

interface Activity {
  date: string;
  duration: number;
}

interface Props {
  activities: Activity[];
  volume?: KpisVolumeDashbardUsecaseModel;
}

const formatVolume = (hours: number, t: (key: string, options?: any) => string) =>
  t('dashboard.volume_hours', { count: hours });

const formatDay = (dateStr: string, locale: string) =>
  new Date(dateStr).toLocaleDateString(locale, { weekday: 'short' });

const heatmapValues = (activities: Activity[]) =>
  activities.map((a) => ({
    date: new Date(a.date).toISOString().split('T')[0],
    count: Math.round(a.duration / 60),
  }));

const MONTHS_AGO = 6;

const ActivityCard: React.FC<Props> = ({ activities, volume }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - MONTHS_AGO);
    return { startDate: start, endDate: end };
  }, []);

  const data = useMemo(
    () =>
      activities
        .filter((a) => {
          const date = new Date(a.date);
          return date >= startDate && date <= endDate;
        })
        .map((a) => ({
          name: formatDay(a.date, i18n.language),
          minutes: Math.round(a.duration / 60),
        })),
    [activities, startDate, endDate, i18n.language],
  );

  const avg = useMemo(
    () =>
      data.length
        ? Math.round(data.reduce((acc, d) => acc + d.minutes, 0) / data.length)
        : 0,
    [data],
  );

  const volumeStats = useMemo(() => {
    if (!volume) return [];

    return [
      { key: 'last15Days', label: t('dashboard.volume_last_15_days'), value: volume.last15Days },
      { key: 'last30Days', label: t('dashboard.volume_last_30_days'), value: volume.last30Days },
      { key: 'last90Days', label: t('dashboard.volume_last_90_days'), value: volume.last90Days },
      { key: 'last6Months', label: t('dashboard.volume_last_6_months'), value: volume.last6Months },
      { key: 'last1Year', label: t('dashboard.volume_last_1_year'), value: volume.last1Year },
    ];
  }, [t, volume]);

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
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
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
            align="center"
            sx={{ display: 'block', mt: 1, color: theme.palette.text.secondary }}
          >
            {t('dashboard.average_duration')}: <strong>{avg} min</strong>
          </Typography>
        </Grid>

        {/* Right: Heatmap */}
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
                endDate={endDate}
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
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2
            }}>
            <Box
              sx={{
                display: 'grid',
                gap: 0.75,
              }}
            >
              {volumeStats.map(({ key, label, value }) => (
                <Box
                  key={key}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'baseline',
                    columnGap: 1,
                    py: 0.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {formatVolume(value.hours, t)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {t('dashboard.volume_sessions', { count: value.sessionsCount })}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActivityCard;
