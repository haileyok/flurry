import React from 'react';
import { IServiceType } from '@src/api/types';
import { Text, XStack, YStack } from 'tamagui';

interface IProps {
  selection: IServiceType;
  onSelectionChange: (selection: IServiceType) => unknown;
}

export default function ServiceSelect({
  selection,
  onSelectionChange,
}: IProps): React.JSX.Element {
  return (
    <XStack flex={1} justifyContent="space-between" alignItems="center">
      <YStack
        borderRadius="$2"
        backgroundColor="$bg"
        paddingVertical="$4"
        height="$7"
        borderColor={selection === 'masto' ? '$accent' : '$fg'}
        borderWidth="$1"
        marginRight="$2"
        alignItems="center"
        justifyContent="center"
        flexBasis="48%"
        onPress={() => onSelectionChange('masto')}
      >
        <Text fontSize="$4" fontWeight="bold">
          Mastodon
        </Text>
      </YStack>
      <YStack
        borderRadius="$2"
        backgroundColor="$bg"
        paddingVertical="$4"
        height="$7"
        borderColor={selection === 'bsky' ? '$accent' : '$fg'}
        borderWidth="$1"
        marginLeft="$2"
        alignItems="center"
        justifyContent="center"
        flexBasis="48%"
        onPress={() => onSelectionChange('bsky')}
      >
        <Text fontSize="$4" fontWeight="bold">
          BlueSky
        </Text>
        <Text fontSize="$2" fontStyle="italic">
          * Invite code required
        </Text>
      </YStack>
    </XStack>
  );
}
