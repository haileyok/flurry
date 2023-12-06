import React, { useMemo } from 'react';
import { Text, TextProps } from 'tamagui';

interface IProps extends TextProps {
  count?: number;
}

export default function Localize({
  count,
  ...rest
}: IProps): React.JSX.Element {
  const localized = useMemo(
    () =>
      count?.toLocaleString('en-US', {
        notation: 'compact',
        maximumSignificantDigits: 3,
        maximumFractionDigits: 3,
      }),
    [count],
  );

  return <Text {...rest}>{localized}</Text>;
}
