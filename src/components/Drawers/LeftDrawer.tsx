import React from 'react';
import { YStack } from 'tamagui';
import FeedsList from '@src/components/Lists/FeedsList';

export default function LeftDrawer(): React.JSX.Element {
  return (
    <YStack backgroundColor="$fg" flex={1} paddingVertical={80}>
      <FeedsList alphabetize showPinned />
    </YStack>
  );
}
