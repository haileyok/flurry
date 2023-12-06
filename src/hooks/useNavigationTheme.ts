import { useEffect, useMemo } from 'react';
import * as SystemUI from 'expo-system-ui';
import { ColorValue } from 'react-native';
import { useTheme } from 'tamagui';
import { DarkTheme, Theme } from '@react-navigation/native';

export const useNavigationTheme = (): Theme => {
  const theme = useTheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.bg?.val as ColorValue);
  }, [theme]);

  // @ts-expect-error TODO
  return useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: theme.accent.val,
        background: theme.bg.val,
        card: theme.bg.val,
        text: theme.color?.val,
        border: theme.border.val,
      },
    }),
    [theme],
  );
};
