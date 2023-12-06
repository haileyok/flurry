import React from 'react';
import { Text, YStack } from 'tamagui';

interface IProps {
  letter: string;
}

export default function FeedListLetterLabel({
  letter,
}: IProps): React.JSX.Element {
  return (
    <YStack
      paddingTop="$5"
      paddingBottom="$2"
      paddingHorizontal="$3"
      borderBottomColor="$border"
      borderBottomWidth={1}
    >
      <Text fontSize="$5" fontWeight="bold">
        {letter}
      </Text>
    </YStack>
  );
}
