export interface Theme {
  accent: string;
  accentHighlight: string;

  fg: string;
  fg2: string;
  bg: string;
  inverse: string;

  color: string;
  secondary: string;

  border: string;

  like: string;
  repost: string;
  save: string;
  reply: string;

  success: string;
  warning: string;
  danger: string;
  info: string;

  statusBar: 'light' | 'dark';
  colorScheme: 'light' | 'dark';
}
