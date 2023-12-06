import { OpaqueColorValue } from 'react-native';
import { ColorTokens } from 'tamagui';
import { ThemeValueFallbackColor } from '@tamagui/web';

export type TamaColor =
  | ColorTokens
  | ThemeValueFallbackColor
  | OpaqueColorValue
  | undefined;
