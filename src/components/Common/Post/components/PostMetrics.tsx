import React from 'react';
import { XStack } from 'tamagui';
import LikeButton from '@src/components/Common/Post/components/buttons/LikeButton';
import RepostButton from '@src/components/Common/Post/components/buttons/RepostButton';
import { IPost } from '@src/types/data';
import ReplyButton from '@src/components/Common/Post/components/buttons/ReplyButton';
import PostContextButton from '@src/components/Common/Post/components/buttons/PostContextButton';

interface IProps {
  post: IPost;
}

export default function PostMetrics({ post }: IProps): React.JSX.Element {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      marginRight="$4"
      marginTop="$2.5"
    >
      <XStack space="$1.5" alignItems="center">
        <ReplyButton post={post} />
      </XStack>
      <RepostButton post={post} />
      <LikeButton
        likes={post.likes}
        like={post.like}
        uri={post.uri}
        cid={post.cid}
      />
      <PostContextButton post={post} />
    </XStack>
  );
}
