import { useTheme } from 'tamagui';

export const useThemeScheme = (): 'light' | 'dark' => {
  const theme = useTheme();
  return theme.colorScheme.val as 'light' | 'dark';
};
