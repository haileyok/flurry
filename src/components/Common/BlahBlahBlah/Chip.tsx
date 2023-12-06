import React from 'react';
import { Text, Token, View } from 'tamagui';
import { TamaColor } from '@src/types/TamaColor';

interface IProps {
  label: string;
  backgroundColor: Exclude<TamaColor, undefined>;
  marginTop?: Token | number;
  marginBottom?: Token | number;
}

/**
 * A chip that is used to indicate things like "is following"
 * @param label
 * @param backgroundColor
 * @param marginTop
 * @param marginBottom
 * @constructor
 */
export default function Chip({
  label,
  backgroundColor,
  marginTop,
  marginBottom,
}: IProps): React.JSX.Element {
  return (
    <View
      alignItems="center"
      justifyContent="center"
      backgroundColor={backgroundColor}
      padding={5}
      borderRadius="$6"
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      <Text fontSize="$2">{label}</Text>
    </View>
  );
}
