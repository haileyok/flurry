import React from 'react';
import { Text } from 'tamagui';
import { makeTimeFrom } from '@src/lib';

interface IProps {
  timestamp?: string;
}

export default function TimeFrom({ timestamp }: IProps): React.JSX.Element {
  return (
    <Text marginLeft="auto" fontSize="$2" color="$secondary">
      {makeTimeFrom(timestamp)}
    </Text>
  );
}
