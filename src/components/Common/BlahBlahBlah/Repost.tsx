import React from 'react';
import { useTheme } from 'tamagui';
import { AntDesign } from '@expo/vector-icons';

interface IProps {
  size: number;
  color?: any;
}

export default function Repost({ size, color }: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <AntDesign
      name="retweet"
      size={size}
      color={color ?? (theme.color?.val as string)}
    />
  );
}
