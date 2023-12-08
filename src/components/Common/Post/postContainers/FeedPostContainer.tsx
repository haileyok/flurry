import React from 'react';
import { YStack } from 'tamagui';
import FeedPost from '@src/components/Common/Post/postTypes/FeedPost';
import { IPost } from '@src/types/data';

interface IProps {
  post: IPost;
}

function FeedPostContainer({ post }: IProps): React.JSX.Element | null {
  if (
    post.labels?.isRendered === false ||
    post?.parent?.labels?.isRendered === false
  ) {
    return null;
  }

  return (
    <YStack borderBottomWidth={1} borderBottomColor="$border">
      {post.hasParent && !post.isRepost && (
        <FeedPost post={post.parent!} drawBottomLine showEmbeddedPosts />
      )}
      <FeedPost
        post={post}
        showEmbeddedPosts
        drawTopLine={post.hasParent && !post.isRepost}
      />
    </YStack>
  );
}

export default React.memo(FeedPostContainer);
