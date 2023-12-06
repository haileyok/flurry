import React from 'react';
import { View } from 'tamagui';
import { IconProps } from '@tamagui/helpers-icon';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface IProps {
  onPress: () => unknown;
  onLongPress?: () => unknown;
  onDoubleTap?: () => unknown;
  visible?: boolean;
  Icon: React.ComponentType<IconProps>;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  position: 'left' | 'right';
}

export default function FAB({
  onPress,
  onLongPress,
  onDoubleTap,
  visible = true,
  Icon,
  iconColor = 'white',
  backgroundColor = '$accent',
  borderColor,
  position,
}: IProps): React.JSX.Element | null {
  // TODO Configuration option here for right/left
  const scale = useSharedValue(1);

  const animateScale = (): void => {
    'worklet';

    scale.value = withSequence(
      withTiming(1.1, { duration: 150 }),
      withTiming(1, { duration: 150 }),
    );
  };

  // Can't just pass in undefined, so we will pass this empty function.
  const noAction = (): void => {};

  // Run the animation on all the other gestures
  const allTapsGesture = Gesture.Tap().onEnd(animateScale);

  const pressHoldGesture = Gesture.LongPress()
    .minDuration(350)
    .onStart(onLongPress ?? noAction);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .minPointers(1)
    .maxDelay(150)
    .onEnd(onDoubleTap ?? noAction);

  // Gesture should only run after both the press hold gesture and the double tap gesture fail
  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .requireExternalGestureToFail(pressHoldGesture)
    .requireExternalGestureToFail(doubleTapGesture)
    .onEnd(onPress);

  const gestures = Gesture.Simultaneous(
    allTapsGesture,
    pressHoldGesture,
    tapGesture,
    doubleTapGesture,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        style={[
          styles.fab,
          { ...(position === 'right' ? { right: 20 } : { left: 20 }) },
          animatedStyle,
        ]}
      >
        <View
          flex={1}
          borderRadius={100}
          justifyContent="center"
          alignItems="center"
          shadowColor="black"
          shadowOffset={{
            width: 0,
            height: 3,
          }}
          shadowOpacity={0.25}
          shadowRadius={4}
          backgroundColor={backgroundColor}
          borderWidth={borderColor != null ? 2 : 0}
          borderColor={borderColor}
        >
          <Icon size={30} color={iconColor} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 15,
    height: 50,
    width: 50,
    borderRadius: 100,
  },
});
