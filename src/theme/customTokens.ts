import { tokens } from '@tamagui/themes';
import { createTokens } from 'tamagui';
import { dark, light } from '@src/theme/themes';

export const customTokens = createTokens({
  ...tokens,

  color: {
    ...tokens.color,
  },

  darkColors: {
    ...dark,
  },

  lightColors: {
    ...light,
  },
});
