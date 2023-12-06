import React, { useCallback } from 'react';
import { Text, useTheme, XStack } from 'tamagui';
import { Heart } from '@tamagui/lucide-icons';
import { playHaptic } from '@src/lib';
import PressInAnimation from '@src/components/Common/Animation/PressInAnimation';
import { useLikeRepostMutation } from '@src/api/queries/bsky/useLikeMutation';
import { useClient } from '@root/App';

interface IProps {
  likes?: number;
  like: string | undefined;
  uri: string;
  cid: string;
  size?: number;
}

function LikeButton({
  likes,
  like,
  uri,
  cid,
  size = 18,
}: IProps): React.JSX.Element {
  const client = useClient();

  const theme = useTheme();

  const mutation = useLikeRepostMutation(client);

  const onPress = useCallback(() => {
    playHaptic();
    mutation.mutate({
      type: 'like',
      like,
      uri,
      cid,
    });
  }, [mutation, like, uri, cid]);

  return (
    <PressInAnimation onPress={onPress}>
      <XStack space="$1.5" alignItems="center">
        <Heart
          size={size}
          color={like != null ? '$like' : '$secondary'}
          fill={theme.like.val as string}
          fillOpacity={like != null ? 1 : 0}
        />
        {likes != null && (
          <Text color={like != null ? '$like' : '$secondary'} fontSize="$2">
            {likes}
          </Text>
        )}
      </XStack>
    </PressInAnimation>
  );
}

export default React.memo(LikeButton);
