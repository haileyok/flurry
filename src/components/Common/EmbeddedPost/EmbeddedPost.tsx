import React, { useCallback } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import CompactPostHeader from '@src/components/Common/EmbeddedPost/components/CompactPostHeader';
import PostContents from '@src/components/Common/Post/components/PostContents';
import { useNav } from '@src/hooks/useNav';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { IPost } from '@src/types/data';
import { AlertCircle } from '@tamagui/lucide-icons';

interface IProps {
  post: Omit<IPost, 'replyRef' | 'shareLink'>;
}

export default function EmbeddedPost({ post }: IProps): React.JSX.Element {
  const navigation = useNav<MainStackParamList>();

  const onPress = useCallback(() => {
    if (post.isNotFound || post.isBlocked) return;

    navigation.push('Post', {
      uri: post.uri,
    });
  }, [navigation, post.isBlocked, post.isNotFound, post.uri]);

  return (
    <YStack
      borderColor="$border"
      borderWidth={1}
      borderRadius="$2"
      paddingVertical="$2"
      paddingHorizontal="$3"
      marginVertical="$2"
      onPress={onPress}
    >
      {post.isNotFound ? (
        <XStack alignItems="center" space="$2">
          <AlertCircle size={26} />
          <Text fontSize="$3">Not found. Was it deleted?</Text>
        </XStack>
      ) : (
        <>
          <CompactPostHeader person={post.creator} createdAt={post.createdAt} />
          <PostContents
            labels={post.labels}
            body={post.body}
            facets={post.facets}
            embed={post.embed}
            isBlocked={post.isBlocked}
          />
        </>
      )}
    </YStack>
  );
}
