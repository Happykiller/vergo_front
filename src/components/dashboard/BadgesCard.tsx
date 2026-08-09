// src\components\dashboard\BadgesCard.tsx
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Avatar, Box, Chip, Grid, IconButton,Tooltip, Typography, useTheme } from '@mui/material';
import { KpisBadgeDashbardUsecaseModel } from '@usecases/dashboard/model/kpis.badge.dashboard.usecase.model';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

type BadgesCardProps = {
  badges?: KpisBadgeDashbardUsecaseModel[];
};

const badgeEmojiByCode: Record<string, string> = {
  'first_step':       '👟',
  'comeback':         '🔄',
  'machine':          '⚙️',
  'loyal':            '🔒',
  'sprinter':         '⚡',
  'marathoner':       '🏃',
  'unstoppable':      '🚀',
  'full_body_warrior': '💪',
};

function formatDate(dateIso?: string, locale = 'fr-FR'): string {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: '2-digit' });
}

/**
 * Show last 3 earned badges with label and earned date.
 * - Uses i18n key: `badges.<code>.label`
 * - Falls back to code if no translation
 */
const BadgesCard: React.FC<BadgesCardProps> = React.memo(({ badges }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  // Compute the last 3 earned badges
  const lastBadges = useMemo(() => {
    if (!badges) return [];
    return badges
      .filter(b => b.earned)
      .sort((a, b) => {
        const da = a.earnedAt ? new Date(a.earnedAt).getTime() : 0;
        const db = b.earnedAt ? new Date(b.earnedAt).getTime() : 0;
        return db - da; // desc
      })
      .slice(0, 3);
  }, [badges]);

  if (!lastBadges.length) return null;

  return (
    <Box
      aria-label={t('dashboard.badges_card')}
      role="region"
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {t('dashboard.badges_recent')}
        </Typography>

        <Tooltip
          title={t('dashboard.gamification.all_badges', 'Voir tous les badges')}
        >
          <IconButton
            size="small"
            component={RouterLink}
            to="/medals"
            aria-label={t('dashboard.gamification.all_badges', 'Voir tous les badges')}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={1} role="list">
        {lastBadges.map((b) => {
          const codeKey = (b.code ?? '').toLowerCase(); // codes are uppercase from backend
          const label = t(`badges.${codeKey}.label`, { defaultValue: b.code });
          const description = t(`badges.${codeKey}.description`, { defaultValue: '' });

          const emoji = badgeEmojiByCode[b.code] ?? '🏅';
          const dateStr = formatDate(b.earnedAt, i18n.language);
          const codeSrc = `/badges/${b.code}.png`;

          const avatar = (
            <Avatar alt={label} src={codeSrc} slotProps={{ img: { loading: 'lazy' } }}>
              {/* Fallback emoji when image fails */}
              {emoji}
            </Avatar>
          );

          return (
            <Grid key={`${b.code}-${b.earnedAt ?? ''}`} size={{ xs: 12, sm: 6, md: 4 }} role="listitem">
              <Chip
                avatar={avatar}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Left block: label + date */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <Typography component="span" variant="body2" sx={{ lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {label}
                      </Typography>
                      {dateStr && (
                        <Typography component="span" variant="caption" sx={{ opacity: 0.7 }}>
                          {dateStr}
                        </Typography>
                      )}
                    </Box>

                    {/* Info button with description */}
                    {description && (
                      <Tooltip title={description} enterTouchDelay={50} placement="top">
                        <IconButton
                          size="small"
                          aria-label={t('dashboard.badge_info', { badge: label })}
                          tabIndex={0}
                          // Keep button focusable inside Chip label
                          onClick={(e) => e.stopPropagation()}
                        >
                          <InfoOutlinedIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                }
                sx={{
                  width: '100%',
                  height: 'auto',
                  justifyContent: 'flex-start',
                  '& .MuiChip-label': { width: '100%', display: 'block' }
                }}
                aria-label={t('dashboard.badge_item', { badge: label, date: dateStr })}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
});

export default BadgesCard;
