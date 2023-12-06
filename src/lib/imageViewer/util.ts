import { Dimensions } from 'react-native';
import { IDimensions } from './types';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

export const getDimensions = (
  dimensions: IDimensions,
  heightModifier: number,
  widthModifier: number,
): IDimensions => {
  if (dimensions.height === 0 || dimensions.width === 0)
    return { height: 200, width: 200 };

  const heightRatio = (SCREEN_HEIGHT * heightModifier) / dimensions.height;
  const widthRatio = (SCREEN_WIDTH * widthModifier) / dimensions.width;

  const ratio = Math.min(widthRatio, heightRatio);

  return {
    height: Math.round(dimensions.height * ratio),
    width: Math.round(dimensions.width * ratio),
  };
};

export const runImpact = (): void => {
  void impactAsync(ImpactFeedbackStyle.Light);
};
