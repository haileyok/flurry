import React from 'react';
import { Button, ButtonProps } from 'tamagui';

interface IProps extends ButtonProps {
  label: string;
  onPress: () => unknown;
}

/**
 * A button that is primarily used during onboarding.
 * @param label
 * @param onPress
 * @param rest
 * @constructor
 */
export default function FullButton({
  label,
  onPress,
  ...rest
}: IProps): React.JSX.Element {
  const btnProps: ButtonProps = {
    backgroundColor: '$accent',
    borderRadius: '$2',
    borderColor:
      rest.backgroundColor === 'transparent' ? '$border' : rest.backgroundColor,
    fontSize: '$3',
    color: rest.backgroundColor == null ? 'white' : '$color',
    ...rest,
  };

  return (
    <Button fontWeight="500" onPress={onPress} {...btnProps}>
      {label}
    </Button>
  );
}
