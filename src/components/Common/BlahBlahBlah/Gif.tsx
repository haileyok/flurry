import React from 'react';
import { useTheme } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IProps {
  size: number;
  color?: string;
}

export default function Gif({ size, color }: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <MaterialCommunityIcons
      name="file-gif-box"
      size={size}
      color={color ?? (theme.color?.val as string)}
    />
  );
}
