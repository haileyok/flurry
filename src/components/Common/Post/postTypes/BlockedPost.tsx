import React from 'react';
import { IPost } from '@src/types/data';
import { Text, XStack, YStack } from 'tamagui';
import { AlertCircle } from '@tamagui/lucide-icons';

interface IProps {
  post: IPost;
}

export default function BlockedPost({ post }: IProps): React.JSX.Element {
  return (
    <YStack padding="$4" backgroundColor="$bg">
      <XStack space="$3" alignItems="center">
        <AlertCircle size={32} />
        <Text fontSize="$3" fontWeight="bold">
          This post is from a blocked user.
        </Text>
      </XStack>
    </YStack>
  );
}
