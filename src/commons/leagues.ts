import { Theme } from '@mui/material';

export interface LeagueDef {
  code: string;
  labelKey: string;
  descKey: string;
  thresholdKey?: string;
}

export interface BadgeDef {
  code: string;
  labelKey: string;
  descKey: string;
}

export const LEAGUES: LeagueDef[] = [
  { code: 'BRONZE',        labelKey: 'leagues.bronze.label',    descKey: 'leagues.bronze.desc',    thresholdKey: 'leagues.bronze.threshold' },
  { code: 'SILVER',        labelKey: 'leagues.silver.label',    descKey: 'leagues.silver.desc',    thresholdKey: 'leagues.silver.threshold' },
  { code: 'GOLD',          labelKey: 'leagues.gold.label',      descKey: 'leagues.gold.desc',      thresholdKey: 'leagues.gold.threshold' },
  { code: 'PLATINUM',      labelKey: 'leagues.platinum.label',  descKey: 'leagues.platinum.desc',  thresholdKey: 'leagues.platinum.threshold' },
  { code: 'DIAMOND',       labelKey: 'leagues.diamond.label',   descKey: 'leagues.diamond.desc',   thresholdKey: 'leagues.diamond.threshold' },
  { code: 'LEGEND',        labelKey: 'leagues.legend.label',    descKey: 'leagues.legend.desc',    thresholdKey: 'leagues.legend.threshold' },
];

export const BADGES: BadgeDef[] = [
  { code: 'FIRST_STEP',       labelKey: 'badges.first_step.label',       descKey: 'badges.first_step.description' },
  { code: 'COMEBACK',         labelKey: 'badges.comeback.label',         descKey: 'badges.comeback.description' },
  { code: 'MACHINE',          labelKey: 'badges.machine.label',          descKey: 'badges.machine.description' },
  { code: 'LOYAL',            labelKey: 'badges.loyal.label',            descKey: 'badges.loyal.description' },
  { code: 'SPRINTER',         labelKey: 'badges.sprinter.label',         descKey: 'badges.sprinter.description' },
  { code: 'MARATHONER',       labelKey: 'badges.marathoner.label',       descKey: 'badges.marathoner.description' },
  { code: 'UNSTOPPABLE',      labelKey: 'badges.unstoppable.label',      descKey: 'badges.unstoppable.description' },
  { code: 'FULL_BODY_WARRIOR', labelKey: 'badges.full_body_warrior.label', descKey: 'badges.full_body_warrior.description' },
];

export const getLeagueColor = (theme: Theme, code?: string): string => {
  const map: Record<string, string> = {
    BRONZE:   theme.palette.warning.dark,
    SILVER:   theme.palette.grey[400],
    GOLD:     '#d4af37',
    PLATINUM: theme.palette.info.light,
    DIAMOND:  '#5ad1ff',
    LEGEND:   theme.palette.secondary.main,
  };
  return (code && map[code]) || theme.palette.primary.main;
};
