// src/theme/index.ts
import { vergoDarkTheme } from './dark';
import { vergoLightTheme } from './light';

export type ThemeMode = 'light' | 'dark';

export const getVergoTheme = (mode: ThemeMode) =>
  mode === 'dark' ? vergoDarkTheme : vergoLightTheme;