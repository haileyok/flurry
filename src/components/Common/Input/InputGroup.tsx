import React from 'react';
import { Label, XStack, YStack } from 'tamagui';
import TextInput, {
  ITextInputProps,
} from '@src/components/Common/Input/TextInput';
import { useThemeScheme } from '@src/hooks';

interface IProps extends ITextInputProps {
  label: string;
  Icon?: () => React.JSX.Element;
}

/**
 * Grouped inputs for the onboarding screen
 * @param label
 * @param Icon
 * @param rest
 * @constructor
 */
export default function InputGroup({
  label,
  Icon,
  ...rest
}: IProps): React.JSX.Element {
  const colorScheme = useThemeScheme();

  return (
    <YStack space="$1">
      <XStack
        alignItems="center"
        marginBottom="$1.5"
        marginLeft="$1.5"
        space="$1.5"
      >
        {Icon != null && <Icon />}
        <Label fontSize="$2">{label}</Label>
      </XStack>
      <TextInput {...rest} keyboardAppearance={colorScheme} />
    </YStack>
  );
}
