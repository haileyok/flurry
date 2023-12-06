import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, useTheme, View, XStack, YStack } from 'tamagui';
import { IconProps } from '@tamagui/helpers-icon';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { playHaptic } from '@src/lib';

interface IProps {
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  dismissOnPress?: boolean;

  initialVisible?: boolean;

  onPress?: () => unknown;

  Icon?: React.ComponentType<IconProps>;

  label?: string;

  position: 'top' | 'bottom';

  children?: React.ReactNode;
}

export interface ToastRef {
  show: () => void;
  dismiss: () => void;
}

export default React.forwardRef<ToastRef, IProps>(function Toast(
  {
    autoDismiss = false,
    autoDismissTimeout = 5000,
    dismissOnPress = true,
    initialVisible = false,
    position,
    onPress,
    Icon,
    label,
    children,
  }: IProps,
  ref,
): React.JSX.Element | null {
  const theme = useTheme();

  const [isVisible, setIsVisible] = useState(initialVisible);

  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoDismiss) {
      timeout.current = setTimeout(() => {
        setIsVisible(false);
      }, autoDismissTimeout);
    }

    return () => {
      if (timeout.current != null) {
        clearTimeout(timeout.current);
      }
    };
  }, [autoDismiss, autoDismissTimeout]);

  const onToastPress = (): void => {
    playHaptic();

    if (dismissOnPress) {
      setIsVisible(false);
    }

    onPress?.();
  };

  const show = (): void => {
    if (isVisible) return;

    setIsVisible(true);
  };

  const dismiss = (): void => {
    if (!isVisible) return;

    setIsVisible(false);
  };

  useImperativeHandle(ref, () => ({
    show,
    dismiss,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: position === 'bottom' ? 10 : undefined,
          top: position === 'top' ? 10 : undefined,
        },
      ]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <XStack
        flex={1}
        onPress={onToastPress}
        hitSlop={3}
        paddingVertical="$1.5"
        paddingHorizontal="$3.5"
        borderRadius={50}
        alignItems="center"
        backgroundColor="$fg"
        shadowColor="$inverse"
        shadowOpacity={0.1}
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 3 }}
      >
        <YStack flex={1}>{label ? <Text>{label}</Text> : children}</YStack>
        <View
          marginLeft="auto"
          backgroundColor="$bg"
          padding="$2.5"
          borderRadius={100}
        >
          {Icon != null && (
            <View>
              <Icon color={theme.accent.val as string} size={20} />
            </View>
          )}
        </View>
      </XStack>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 5,
  },
});
