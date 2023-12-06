import React, { useCallback } from 'react';
import { Text, XStack } from 'tamagui';
import { MessageCircle } from '@tamagui/lucide-icons';
import { playHaptic } from '@src/lib';
import PressInAnimation from '@src/components/Common/Animation/PressInAnimation';
import { IPost } from '@src/types/data';
import { useNav } from '@src/hooks/useNav';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';

interface IProps {
  post: IPost;
  size?: number;
  showReplies?: boolean;
}

function ReplyButton({
  post,
  size = 18,
  showReplies = true,
}: IProps): React.JSX.Element {
  const navigation = useNav<MainStackParamList>();

  const onPress = useCallback(() => {
    playHaptic();
    navigation.push('NewPost', {
      replyTo: post,
    });
  }, [navigation, post]);

  return (
    <PressInAnimation onPress={onPress}>
      <XStack space="$1.5" alignItems="center">
        <MessageCircle size={size} color="$secondary" />
        {showReplies && (
          <Text color="$secondary" fontSize="$2">
            {post.replies}
          </Text>
        )}
      </XStack>
    </PressInAnimation>
  );
}

// Since we are passing in the whole post, let's make sure we only re-render
// when the post actually changes
export default React.memo(
  ReplyButton,
  (prev, next) => prev.post.cid === next.post.cid,
);
