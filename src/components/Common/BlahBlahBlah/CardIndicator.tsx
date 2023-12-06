import React from 'react';
import { View } from 'tamagui';

interface IProps {
  visible?: boolean;
  color: string;
}

/**
 * A small triangle indicator for cards.
 * @param {boolean | undefined} visible - Whether to display the indicator. Defaults to false.
 * @param {string} color - The color of the indicator
 * @returns {React.JSX.Element | null}
 * @constructor
 */
export default function CardIndicator({
  visible = true,
  color,
}: IProps): React.JSX.Element | null {
  if (!visible) return null;

  return (
    <View
      position="absolute"
      top={0}
      right={0}
      width={0}
      height={0}
      borderTopWidth={16}
      borderLeftWidth={16}
      borderLeftColor="transparent"
      borderTopColor={color}
    />
  );
}
