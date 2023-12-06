import React, { useCallback } from 'react';
import { Input, InputProps } from 'tamagui';
import { useThemeScheme } from '@src/hooks';

export interface ITextInputProps extends InputProps {
  name: string;
  onTextChange: (text: string, name: string) => unknown;
}

/**
 * Customized text input for the onboarding screen (as well as a few other places)
 * @param name
 * @param onTextChange
 * @param rest
 * @constructor
 */
export default function TextInput({
  name,
  onTextChange,
  ...rest
}: ITextInputProps): React.JSX.Element {
  const colorScheme = useThemeScheme();

  const onChange = useCallback(
    (text: string) => {
      onTextChange(text, name);
    },
    [name, onTextChange],
  );

  const inputProps: InputProps = {
    backgroundColor: '$fg',
    size: '$3.5',
    borderColor: '$fg',
    keyboardAppearance: colorScheme,
    ...rest,
  };

  return <Input {...inputProps} onChangeText={onChange} />;
}
