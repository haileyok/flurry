import React, { useCallback } from 'react';
import { View, XStack, YStack } from 'tamagui';
import Avatar from '@src/components/Common/Profile/Avatar';
import PostHeader from '@src/components/Common/Post/components/PostHeader';
import PostContents from '@src/components/Common/Post/components/PostContents';
import PostMetrics from '@src/components/Common/Post/components/PostMetrics';
import { useNavigation } from '@react-navigation/core';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IPost } from '@src/types/data';
import PostRepostLabel from '@src/components/Common/Post/components/PostRepostLabel';
import PostReplyToLabel from '@src/components/Common/Post/components/PostReplyToLabel';
import NotFoundPost from '@src/components/Common/Post/postTypes/NotFoundPost';

interface IProps {
  post: IPost;
  showEmbeddedPosts?: boolean;
  avatarSize?: number;
  drawTopLine?: boolean;
  drawBottomLine?: boolean;
  borderBottom?: boolean;
  showMetrics?: boolean;
}

/*
 * For the feed post, we want the entire post to be memoized to help in flashlist performance. However, because the
 * post is going to be mutated by various actions such as repost, like, etc, we want to make sure that the subcomponents
 * are also memoized separately. In particular:
 * - Avatars should be memoized. This is the default functionality of `Avatar`, so nothing to do there.
 * - The repost/reply labels as well as the header do not need to be memoized as these are inexpensive functions. The
 *   only thing that is remotely expensive in the header is the `TimeFrom` component, but that is memoized internally.
 * - `PostContents` should be memoized since there are various - particularly images - expensive things that can
 *   happen there.
 * - `PostMetrics` itself is not not memoized, since any of the actions would cause that component to re-render anyway.
 *   Instead, each of the individual action buttons is memoized. The reply button is not memoized however, since we
 *   always want the latest post to be passed to it (to send to the `NewPost` screen).
 */

/**
 * A post in the feed.
 * @param {IPost} post
 * @param {boolean | undefined} showEmbeddedPosts - Whether to show embedded posts. Defaults to false.
 * @param {number | undefined} avatarSize - Size of the avatar to display. Defaults to 48.
 * @param {boolean | undefined} drawTopLine - Whether to draw a line above the avatar. Defaults to false.
 * @param {boolean | undefined} drawBottomLine - Whether to draw a line below the avatar. Defaults to false.
 * @param {boolean | undefined} borderBottom - Whether to add a border to the bottom of the post. Defaults to false.
 * @param {boolean | undefined} showMetrics - Whether to show the post metrics. Defaults to true.
 * @returns {React.JSX.Element}
 * @constructor
 */
function FeedPost({
  post,
  showEmbeddedPosts = false,
  avatarSize = 42,
  drawTopLine = false,
  drawBottomLine = false,
  borderBottom = false,
  showMetrics = true,
}: IProps): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // Navigate on press
  const onPress = useCallback(() => {
    navigation.push('Post', {
      post,
      uri: post.uri,
    });
  }, [navigation, post]);

  if (post.isNotFound) {
    return <NotFoundPost />;
  }

  return (
    <YStack
      paddingHorizontal="$2.5"
      backgroundColor="$bg"
      borderColor="$border"
      borderBottomWidth={borderBottom ? 1 : 0}
      onPress={onPress}
    >
      {post.isRepost && <PostRepostLabel person={post.repostedBy} />}
      {post.hasRoot && <PostReplyToLabel person={post.root!.creator} />}
      <XStack space="$2.5">
        <YStack alignItems="center">
          <View
            height={14}
            width={2}
            backgroundColor={drawTopLine ? '$border' : 'transparent'}
          />
          <Avatar
            person={post.creator}
            size={avatarSize}
            pressAction="profile"
          />
          <View
            flex={1}
            backgroundColor={drawBottomLine ? '$border' : 'transparent'}
            width={2}
          />
        </YStack>
        <YStack flex={1} paddingVertical="$2.5">
          <PostHeader
            person={post.creator}
            createdAt={post.createdAt}
            type="regular"
          />

          <PostContents
            labels={post.labels}
            body={post.body}
            facets={post.facets}
            embed={post.embed}
            showEmbeddedPosts={showEmbeddedPosts}
            isBlocked={post.isBlocked}
          />
          {!post.isBlocked && showMetrics && <PostMetrics post={post} />}
        </YStack>
      </XStack>
    </YStack>
  );
}

export default React.memo(FeedPost);
