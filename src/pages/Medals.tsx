import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import inversify from '@src/commons/inversify';
import { useAsyncTask } from '@hooks/useAsyncTask';
import { KpisDashbardUsecaseModel } from '@usecases/dashboard/model/kpis.dashboard.usecase.model';
import { LEAGUES, BADGES, getLeagueColor } from '@src/commons/leagues';

const Medals: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [datas, setDatas] = useState<KpisDashbardUsecaseModel>();
  const { execute, error } = useAsyncTask();

  useEffect(() => {
    execute(async () => {
      const response = await inversify.getKpisDashboardUsecase.execute();
      if (response.data) {
        setDatas(response.data);
      }
    });
  }, [execute]);

  const badgesWithState = BADGES.map((b) => {
    const state = datas?.badges.find((db) => db.code === b.code);
    return { ...b, earned: state?.earned ?? false, earnedAt: state?.earnedAt ?? null };
  });

  return (
    <Box sx={{ px: 2, py: 3, maxWidth: 1024, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={800}>
          {t('medals.title', 'Ligues')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" mb={3}>
        {t('medals.subtitle', "Découvrez tous les blasons, leurs paliers et ce qu'ils représentent.")}
      </Typography>

      <Grid container spacing={2}>
        {LEAGUES.map(({ code, labelKey, descKey, thresholdKey }) => (
          <Grid key={code} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 12px ${theme.palette.primary.main}22, inset 0 0 8px rgba(255,255,255,0.03)`,
                border: `1px solid ${theme.palette.primary.main}33`,
              }}
            >
              <CardMedia
                component="img"
                image={`/leagues/${code}.png`}
                alt={t(labelKey)}
                sx={{
                  objectFit: 'contain',
                  height: 160,
                  p: 2,
                  filter: theme.palette.mode === 'dark' ? 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' : 'none',
                }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Chip
                    size="small"
                    label={t(labelKey)}
                    sx={{
                      bgcolor: `${getLeagueColor(theme, code)}22`,
                      color: getLeagueColor(theme, code),
                      fontWeight: 700,
                    }}
                  />
                </Box>

                {thresholdKey && (
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                    {t('medals.threshold', 'Palier')}: {t(thresholdKey)}
                  </Typography>
                )}

                <Typography variant="body2">
                  {t(descKey)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={800} mt={4} mb={2}>
        {t('medals.badges_title', 'Badges')}
      </Typography>

      <Grid container spacing={2}>
        {badgesWithState.map(({ code, labelKey, descKey, earned, earnedAt }) => (
          <Grid key={code} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 12px ${theme.palette.primary.main}22, inset 0 0 8px rgba(255,255,255,0.03)`,
                border: `1px solid ${theme.palette.primary.main}33`,
                opacity: earned ? 1 : 0.4,
              }}
            >
              <CardMedia
                component="img"
                image={`/badges/${code}.png`}
                alt={t(labelKey)}
                sx={{
                  objectFit: 'contain',
                  height: 120,
                  p: 2,
                  filter:
                    theme.palette.mode === 'dark'
                      ? 'drop-shadow(0 2px 8px rgba(0,0,0,.5))'
                      : 'none',
                }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {t(labelKey)}
                </Typography>
                {earned && earnedAt && (
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                    {new Date(earnedAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: '2-digit' })}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {t(descKey)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Medals;
