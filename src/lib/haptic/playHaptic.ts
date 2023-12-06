import * as Haptics from 'expo-haptics';

export const playHaptic = (type?: Haptics.ImpactFeedbackStyle): void => {
  // TODO Configurable haptic feedback
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
