import { Theme } from '@src/theme/types';
import { themeDefaults } from '@src/theme/themes/themeDefaults';

export const dark: Theme = {
  ...themeDefaults,

  accent: '#007AFF',
  accentHighlight: '#B3D7FF',

  color: '#fff',
  secondary: '#bfbdbf',

  bg: '#000000',
  fg: '#151515',
  fg2: '#111111',
  inverse: '#fff',

  border: '#313131',

  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: 'blue',

  statusBar: 'light',
  colorScheme: 'dark',
} as Theme;
