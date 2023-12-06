import React, { useCallback } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { playHaptic } from '@src/lib';

interface IProps {
  onPress?: () => unknown;
  children: React.ReactNode;
  growScale?: number;
}

/**
 * Anything wrapped inside this component will scale after the press event has taken place.
 * @param onPress
 * @param children
 * @param growScale - Default 1.3
 * @constructor
 */
export default function PressInAnimation({
  onPress,
  children,
  growScale = 1.3,
}: IProps): React.JSX.Element {
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const timingOnPress = useCallback(() => {
    scale.value = withSequence(
      withTiming(growScale, { duration: 150 }),
      withTiming(1, { duration: 150 }),
    );
    playHaptic();
    onPress?.();
  }, [scale, growScale, onPress]);

  return (
    <Pressable onPress={timingOnPress} hitSlop={5}>
      <Animated.View style={[scaleStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
