// src\components\dashboard\GamificationCard.tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography, useTheme, Chip, Paper, LinearProgress, Skeleton } from '@mui/material';

// ---------- Types (import from your model if already created) ----------
export type LeagueCode = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'LEGEND' | string;

export interface KpisLeagueSnapshot {
  code: LeagueCode;
  minutes: number;
  threshold: number;
  nextCode?: LeagueCode;
  nextThreshold?: number;
}

export interface KpisGamificationDashbardUsecaseModel {
  xp: number;
  level: number;
  levelXp: number;
  levelXpToNext: number;
  levelProgressPct: number; // 0..100
  league: KpisLeagueSnapshot;
  weeklyLeague: KpisLeagueSnapshot;
}

interface Props {
  gamification?: KpisGamificationDashbardUsecaseModel; // optional => skeleton
}

// ---------- Helpers ----------
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

// Computes progress from current league threshold to next threshold
const computeLeaguePct = (snap: KpisLeagueSnapshot): number => {
  const from = snap.threshold ?? 0;
  const to = snap.nextThreshold ?? Math.max(from, snap.minutes); // avoid div by 0
  const progress = snap.minutes - from;
  const span = Math.max(1, to - from);
  return clamp((progress / span) * 100);
};

// ---------- Component ----------
const GamificationCard: React.FC<Props> = React.memo(({ gamification }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const monthlyPct = useMemo(
    () => (gamification ? computeLeaguePct(gamification.league) : 0),
    [gamification]
  );
  const weeklyPct = useMemo(
    () => (gamification ? computeLeaguePct(gamification.weeklyLeague) : 0),
    [gamification]
  );

  const ringPct = clamp(gamification?.levelProgressPct ?? 0);

  // Colors per league (fallback to primary)
  const leagueColor = (code?: LeagueCode) => {
    const map: Record<string, string> = {
      BRONZE: theme.palette.warning.dark,
      SILVER: theme.palette.grey[400],
      GOLD: '#d4af37',
      PLATINUM: theme.palette.info.light,
      DIAMOND: '#5ad1ff',
      LEGEND: theme.palette.secondary.main,
    };
    return (code && map[code]) || theme.palette.primary.main;
  };

  // Card container styles (Vergo halo)
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
      <Typography variant="h6" fontWeight="bold" mb={1}>
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
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              {/* Radial progress using two stacked circles */}
              <Box
                role="progressbar"
                aria-valuenow={Math.round(ringPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                sx={{
                  position: 'relative',
                  width: 140,
                  height: 140,
                }}
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
                {/* Progress arc (conic-gradient for performance) */}
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
                  <Typography variant="h5" fontWeight={700}>
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

          {/* Right: Leagues */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              {/* Monthly league */}
              <Grid size={{ xs: 12 }}>
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        size="small"
                        label={gamification.league.code}
                        sx={{ bgcolor: `${leagueColor(gamification.league.code)}22`, color: leagueColor(gamification.league.code) }}
                      />
                      <Typography variant="caption">→</Typography>
                      <Chip
                        size="small"
                        label={gamification.league.nextCode ?? '—'}
                        sx={{ bgcolor: `${leagueColor(gamification.league.nextCode)}22`, color: leagueColor(gamification.league.nextCode) }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {gamification.league.minutes} / {gamification.league.nextThreshold ?? gamification.league.threshold} min
                    </Typography>
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
                  <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                    {t('dashboard.gamification.threshold', 'Seuil')}{' '}
                    {gamification.league.code}: {gamification.league.threshold} min
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
