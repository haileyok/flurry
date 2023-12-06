import React, { useCallback } from 'react';
import { IPost } from '@src/types/data';
import { Text, XStack, YStack } from 'tamagui';
import Localize from '@src/lib/localize/Localize';
import Pluralize from '@src/lib/pluralize/Pluralize';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import LikeButton from '@src/components/Common/Post/components/buttons/LikeButton';
import RepostButton from '@src/components/Common/Post/components/buttons/RepostButton';
import { Share } from '@tamagui/lucide-icons';
import ReplyButton from '@src/components/Common/Post/components/buttons/ReplyButton';
import PostContextButton from '@src/components/Common/Post/components/buttons/PostContextButton';
import { shareLink } from '@src/lib';
import PressInAnimation from '@src/components/Common/Animation/PressInAnimation';

interface IProps {
  post: IPost;
}

export default function MainPostMetrics({ post }: IProps): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const onRepostsPress = useCallback(() => {
    navigation.push('PersonList', {
      type: 'repost',
      uri: post.uri,
    });
  }, [navigation, post.uri]);

  const onLikePress = useCallback(() => {
    navigation.push('PersonList', {
      type: 'like',
      uri: post.uri,
    });
  }, [navigation, post.uri]);

  const onSharePress = useCallback(() => {
    void shareLink({
      uri: post.shareLink,
    });
  }, [post.shareLink]);

  return (
    <YStack justifyContent="center">
      <XStack
        space="$3"
        paddingVertical="$2.5"
        borderColor="$border"
        borderBottomWidth={1}
        borderTopWidth={1}
      >
        <Text fontSize="$3">
          <Localize count={post.replies} fontWeight="bold" />{' '}
          <Pluralize
            single="Reply"
            plural="Replies"
            count={post.replies}
            color="$secondary"
          />
        </Text>
        <Text fontSize="$3" onPress={onRepostsPress} hitSlop={5}>
          <Localize count={post.reposts} fontWeight="bold" />{' '}
          <Pluralize single="Repost" count={post.reposts} color="$secondary" />
        </Text>
        <Text fontSize="$3" onPress={onLikePress} hitSlop={5}>
          <Localize count={post.likes} fontWeight="bold" />{' '}
          <Pluralize single="Like" count={post.likes} color="$secondary" />
        </Text>
      </XStack>
      <XStack
        paddingTop="$2.5"
        justifyContent="space-between"
        marginHorizontal="$3"
      >
        <ReplyButton post={post} size={22} showReplies={false} />
        <RepostButton post={post} size={22} />
        <LikeButton like={post.like} uri={post.uri} cid={post.cid} size={22} />
        <PressInAnimation onPress={onSharePress}>
          <Share size={22} color="$secondary" />
        </PressInAnimation>
        <PostContextButton post={post} />
      </XStack>
    </YStack>
  );
}
