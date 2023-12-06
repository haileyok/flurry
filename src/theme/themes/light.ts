import { Theme } from '@src/theme/types';
import { themeDefaults } from '@src/theme/themes/themeDefaults';

export const light: Theme = {
  ...themeDefaults,

  accent: '#007AFF',
  accentHighlight: '#B3D7FF',

  color: '#191619',
  secondary: '#575757',

  bg: '#fff',
  fg: '#f5f5f5',
  fg2: '#fd0202',
  inverse: '#000',

  border: '#e5e5e5',

  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: 'blue',

  statusBar: 'dark',
  colorScheme: 'light',
} as Theme;
