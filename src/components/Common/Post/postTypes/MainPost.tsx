import React, { useMemo } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import Avatar from '@src/components/Common/Profile/Avatar';
import PostContents from '@src/components/Common/Post/components/PostContents';
import PostHeader from '@src/components/Common/Post/components/PostHeader';
import { makeTimestamp } from '@src/lib';
import { IEmbed, IPost } from '@src/types/data';
import MainPostMetrics from '@src/components/Common/Post/components/MainPostMetrics';

interface IProps {
  post: IPost;
  showEmbeddedPosts?: boolean;
}

/**
 * The post component used for the "main post" in a thread.
 * @param {IPost} post - The post to render
 * @returns {React.JSX.Element}
 * @constructor
 */
function MainPost({ post }: IProps): React.JSX.Element {
  const timestamp = useMemo(
    () => makeTimestamp(post.createdAt),
    [post.createdAt],
  );

  return (
    <XStack
      paddingVertical="$3"
      paddingHorizontal="$3"
      backgroundColor="$bg"
      borderColor="$border"
      borderTopWidth={post.hasParent ? 1 : 0}
      borderBottomWidth={1}
      space="$4"
    >
      <YStack flex={1}>
        <XStack space="$3" alignItems="center" marginBottom="$2">
          <Avatar person={post.creator} size={46} pressAction="profile" />
          <PostHeader
            person={post.creator}
            createdAt={post.createdAt}
            type="main"
          />
        </XStack>
        <PostContents
          labels={post.labels}
          body={post.body}
          facets={post.facets}
          embed={post.embed as IEmbed}
          showEmbeddedPosts={true}
          fontSize="$5"
          isBlocked={post.isBlocked}
          lineHeight="$5"
        />
        <XStack marginVertical="$3">
          <Text color="$secondary" fontSize="$2">
            {timestamp}
          </Text>
        </XStack>
        <MainPostMetrics post={post} />
      </YStack>
    </XStack>
  );
}

export default React.memo(MainPost);
