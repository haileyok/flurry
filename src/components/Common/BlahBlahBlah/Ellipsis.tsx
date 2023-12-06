import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';

interface IProps {
  size: number;
  color?: string;
}

export default function Ellipsis({ size, color }: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Ionicons
      name="ellipsis-horizontal"
      size={size}
      color={color ?? (theme.color?.val as string)}
    />
  );
}
