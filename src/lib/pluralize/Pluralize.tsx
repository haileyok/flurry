import React, { useMemo } from 'react';
import { Text, TextProps } from 'tamagui';

interface IProps extends TextProps {
  single: string;
  plural?: string;
  count?: number;
}

export default function Pluralize({
  single,
  plural,
  count,
  ...rest
}: IProps): React.JSX.Element {
  const text = useMemo(() => {
    if (count !== 1) {
      if (plural != null) {
        return plural;
      } else {
        return single + 's';
      }
    } else {
      return single;
    }
  }, [single, plural, count]);

  return <Text {...rest}>{text}</Text>;
}
