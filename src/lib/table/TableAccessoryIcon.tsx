import React from 'react';
import { View } from 'tamagui';
import { IconProps } from '@tamagui/helpers-icon';

interface IProps {
  Icon: React.FunctionComponent<IconProps>;
  color: string;
}

export default function TableAccessoryIcon({
  Icon,
  color,
}: IProps): React.JSX.Element {
  return (
    <View
      backgroundColor={color}
      borderRadius={50}
      height={35}
      width={35}
      alignItems="center"
      justifyContent="center"
    >
      <Icon size={20} color="white" />
    </View>
  );
}
