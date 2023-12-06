import { ColorSchemeName, useColorScheme } from 'react-native';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { useEffect, useMemo, useRef, useState } from 'react';

export const useHandleTheme = (): ColorSchemeName => {
  const followSystem = useSettingsStore.use.followSystemScheme();
  const themeSelection = useSettingsStore.use.theme();

  const colorScheme = useColorScheme();
  const [usedColorScheme, setUsedColorScheme] =
    useState<ColorSchemeName>(colorScheme);
  const lastColorScheme = useRef<ColorSchemeName>(colorScheme);

  useEffect(() => {
    if (colorScheme !== lastColorScheme.current) {
      setTimeout(() => {
        if (colorScheme === lastColorScheme.current) {
          setUsedColorScheme(colorScheme);
        }
      }, 500);
    }

    lastColorScheme.current = colorScheme;
  }, [colorScheme]);

  return useMemo(() => {
    if (followSystem) {
      return usedColorScheme;
    } else {
      return themeSelection;
    }
  }, [usedColorScheme, followSystem, themeSelection]);
};
