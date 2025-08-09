// src\usecases\dashboard\model\kpis.gamification.dashboard.usecase.model.ts
export type LeagueCode =
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND'
  | 'LEGEND'
  | string; // Keep open to avoid breaking if new codes are added

export interface KpisLeagueSnapshot {
  code: LeagueCode;
  minutes: number;        // total minutes accumulated in the period
  threshold: number;      // threshold for current league baseline
  nextCode?: LeagueCode;  // next league target code
  nextThreshold?: number; // minutes required for next league
}

export interface KpisGamificationDashbardUsecaseModel {
  xp: number;                // total user XP
  level: number;             // current level
  levelXp: number;           // XP earned within the current level
  levelXpToNext: number;     // XP remaining to reach next level
  levelProgressPct: number;  // current level progress in percent (0..100)
  league: KpisLeagueSnapshot;       // monthly league snapshot
  weeklyLeague: KpisLeagueSnapshot; // weekly league snapshot
}
