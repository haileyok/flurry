import { createInterFont } from '@tamagui/font-inter';
import { createTamagui, TamaguiConfig } from 'tamagui';
import { shorthands } from '@tamagui/shorthands';
import { customThemes, customTokens } from '@src/theme';
import { createAnimations } from '@tamagui/animations-moti';
import { config } from '@tamagui/config/v2-native';

const font = createInterFont({
  family: 'Inter',
  size: {
    1: 12, // Starting Font Size - Only whole numbers available in configuration
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 22,
    7: 24,
    8: 26, // Ending Font Size
    9: 30, // Additional font sizes for onboarding
    10: 36,
    11: 40,
    12: 48,
  },
  lineHeight: config.fonts.body.lineHeight,
  weight: config.fonts.body.weight,
  letterSpacing: config.fonts.body.letterSpacing,
  face: {
    300: {
      normal: 'InterLight',
      italic: 'InterLightItalic',
    },
    500: {
      normal: 'Inter',
      italic: 'InterItalic',
    },
    700: {
      normal: 'InterSemiBold',
      italic: 'InterSemiBoldItalic',
    },
    900: {
      normal: 'InterBold',
      italic: 'InterBoldItalic',
    },
  },
});

const tamaguiConfig: TamaguiConfig = createTamagui({
  shorthands,
  tokens: customTokens,
  fonts: {
    body: font,
  },
  themes: customThemes,
  animations: createAnimations({
    fast: {
      type: 'spring',
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    medium: {
      type: 'spring',
    },
    slow: {
      type: 'spring',
      damping: 20,
      stiffness: 60,
    },
  }),
});

type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  // @ts-expect-error stop
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
