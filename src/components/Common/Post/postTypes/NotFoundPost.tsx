import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { AlertCircle } from '@tamagui/lucide-icons';

export default function NotFoundPost(): React.JSX.Element {
  return (
    <YStack padding="$4" backgroundColor="$bg">
      <XStack space="$3" alignItems="center">
        <AlertCircle size={32} />
        <Text fontSize="$3" fontWeight="bold">
          Post not found. Was it deleted?
        </Text>
      </XStack>
    </YStack>
  );
}
