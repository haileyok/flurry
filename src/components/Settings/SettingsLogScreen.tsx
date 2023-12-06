import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { ILogMessage } from '@src/types/ILogMessage';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useLogMessages } from '@src/state/log';

const renderItem = ({
  item,
}: ListRenderItemInfo<ILogMessage>): React.JSX.Element => (
  <YStack padding="$2" borderBottomColor="$border" borderBottomWidth={1}>
    <XStack space="$2">
      <Text>{item.type}</Text>
      <Text>{item.time}</Text>
    </XStack>
    <YStack flex={1}>
      <Text>{item.message}</Text>
    </YStack>
  </YStack>
);

const keyExtractor = (item: ILogMessage, index: number): string =>
  item.time + index.toString();

export default function SettingsLogScreen(): React.JSX.Element {
  const data = useLogMessages();

  return (
    <YStack flex={1}>
      <FlashList
        renderItem={renderItem}
        data={data}
        estimatedItemSize={300}
        keyExtractor={keyExtractor}
      />
    </YStack>
  );
}
