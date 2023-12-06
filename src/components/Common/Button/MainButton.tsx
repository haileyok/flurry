import React, { useCallback } from 'react';
import { Button, ButtonProps, Text } from 'tamagui';
import { playHaptic } from '@src/lib';

interface IProps extends ButtonProps {
  label: string;
  onPress: () => unknown;
  highlight?: boolean;
  floatRight?: boolean;
}

/**
 * A button that is primarily used throughout the app except for onboarding. Can be either highlighted (with accent) or not
 * (will use inverse colors of the current theme).
 * @param label
 * @param onPress
 * @param highlight
 * @param floatRight
 * @param rest
 * @constructor
 */
export default function MainButton({
  label,
  onPress,
  highlight = false,
  floatRight = false,
  ...rest
}: IProps): React.JSX.Element {
  const onPressOuter = useCallback(() => {
    onPress();
    playHaptic();
  }, [onPress]);

  return (
    <Button
      {...rest}
      backgroundColor={highlight ? '$accent' : '$inverse'}
      height={30}
      onPress={onPressOuter}
      borderRadius={16.5}
      paddingHorizontal="$3"
      marginLeft={floatRight ? 'auto' : undefined}
    >
      <Text fontWeight="500" color={highlight ? 'white' : '$fg'}>
        {label}
      </Text>
    </Button>
  );
}
