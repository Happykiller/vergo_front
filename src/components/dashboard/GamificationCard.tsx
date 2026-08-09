import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Chip,Grid, IconButton, LinearProgress, Paper, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import { getLeagueColor,LEAGUES } from '@src/commons/leagues';
import { KpisGamificationDashbardUsecaseModel, KpisLeagueSnapshot } from '@usecases/dashboard/model/kpis.gamification.dashboard.usecase.model';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  gamification?: KpisGamificationDashbardUsecaseModel;
}

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

const computeLeaguePct = (snap: KpisLeagueSnapshot): number => {
  const from = snap.threshold ?? 0;
  const to = snap.nextThreshold ?? Math.max(from, snap.minutes);
  const progress = snap.minutes - from;
  const span = Math.max(1, to - from);
  return clamp((progress / span) * 100);
};

const GamificationCard: React.FC<Props> = React.memo(({ gamification }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const monthlyPct = useMemo(
    () => (gamification ? computeLeaguePct(gamification.league) : 0),
    [gamification],
  );

  const ringPct = clamp(gamification?.levelProgressPct ?? 0);

  const cardSx = {
    borderRadius: `${theme.shape.borderRadius}px`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: `0 0 12px ${theme.palette.primary.main}22, inset 0 0 8px rgba(255,255,255,0.03)`,
    border: `1px solid ${theme.palette.primary.main}33`,
    p: 2,
    mb: 2,
  };

  return (
    <Box sx={cardSx}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        {t('dashboard.gamification.title', 'Gamification')}
      </Typography>

      {!gamification ? (
        <Box>
          <Skeleton height={140} />
          <Skeleton height={24} sx={{ mt: 2 }} />
          <Skeleton height={24} />
          <Skeleton height={56} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {/* Left: XP radial + copy */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                gap: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Box
                role="progressbar"
                aria-valuenow={Math.round(ringPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                sx={{ position: 'relative', width: 140, height: 140 }}
              >
                {/* Background ring */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `8px solid ${theme.palette.action.hover}`,
                  }}
                />
                {/* Progress arc (conic-gradient) */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: `conic-gradient(${theme.palette.primary.main} ${ringPct}%, transparent ${ringPct}%)`,
                    mask: 'radial-gradient(farthest-side, transparent 60%, black 61%)',
                  }}
                />
                {/* Center label */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    gap: 0.5,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Lv {gamification.level}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {gamification.levelXp} / {gamification.levelXp + gamification.levelXpToNext} XP
                  </Typography>
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary">
                {t('dashboard.gamification.next_level', 'Prochain niveau dans')} {gamification.levelXpToNext} XP
              </Typography>
            </Box>
          </Grid>

          {/* Right: League */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Box
                    sx={{
                      gap: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}>
                    <Box
                      sx={{
                        gap: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                      <img
                        src={`/leagues/${gamification.league.code}.png`}
                        alt={gamification.league.code}
                        width={64}
                        height={64}
                        style={{ objectFit: 'contain' }}
                      />
                      <ArrowForwardIosRoundedIcon fontSize="small" />
                      {gamification.league.nextCode ? (
                        <img
                          src={`/leagues/${gamification.league.nextCode}.png`}
                          alt={gamification.league.nextCode}
                          width={64}
                          height={64}
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <Typography variant="caption">—</Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {gamification.league.minutes} / {gamification.league.nextThreshold ?? gamification.league.threshold} min
                    </Typography>

                    <Tooltip title={t('dashboard.gamification.all_badges', 'Voir tous les blasons')}>
                      <IconButton
                        size="small"
                        component={RouterLink}
                        to="/medals"
                        aria-label={t('dashboard.gamification.all_badges', 'Voir tous les blasons')}
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={monthlyPct}
                    aria-label={t('dashboard.gamification.monthly_progress', 'Progression mensuelle')}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      [`& .MuiLinearProgress-bar`]: { transition: 'width 400ms ease' },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {t('dashboard.gamification.threshold', 'Seuil')}{' '}
                    <Chip
                      size="small"
                      label={t(
                        LEAGUES.find((l) => l.code === gamification.league.code)?.labelKey
                          ?? 'gamification.league.unknown',
                      )}
                      sx={{
                        bgcolor: `${getLeagueColor(theme, gamification.league.code)}22`,
                        color: getLeagueColor(theme, gamification.league.code),
                        fontWeight: 700,
                      }}
                    />: {gamification.league.threshold} min
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
});

export default GamificationCard;
