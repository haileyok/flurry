import React from 'react';
import { Text, useTheme, XStack } from 'tamagui';
import PressInAnimation from '@src/components/Common/Animation/PressInAnimation';
import Repost from '@src/components/Common/BlahBlahBlah/Repost';
import ContextMenuButton from '@src/components/Common/Button/ContextMenuButton';
import { IContextMenuActionGroup } from '@src/types/IContextMenuAction';
import { useLikeRepostMutation } from '@src/api/queries/bsky/useLikeMutation';
import { playHaptic } from '@src/lib';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { useNav } from '@src/hooks';
import { IPost } from '@src/types/data';
import { useClient } from '@root/App';

interface IProps {
  post: IPost;
  size?: number;
}

function RepostButton({ post, size = 18 }: IProps): React.JSX.Element {
  const client = useClient();

  const navigation = useNav<MainStackParamList>();
  const theme = useTheme();
  const mutation = useLikeRepostMutation(client);

  const { uri, cid, repost, reposts } = post;

  const actions: IContextMenuActionGroup[] = [
    {
      key: 'group1',
      actions: [
        {
          label: post.repost != null ? 'Delete Repost' : 'Repost',
          key: 'repost',
          onSelect: () => {
            playHaptic();
            mutation.mutate({
              type: 'repost',
              uri,
              cid,
              repost,
            });
          },
        },
        {
          label: 'Quote',
          key: 'quote',
          onSelect: () => {
            navigation.push('NewPost', {
              quote: post,
            });
          },
        },
      ],
    },
  ];

  return (
    <ContextMenuButton actions={actions}>
      <PressInAnimation>
        <XStack space="$1.5" alignItems="center">
          <Repost
            size={size}
            color={
              repost != null
                ? (theme.repost.val as string)
                : (theme.secondary?.val as string)
            }
          />
          {reposts != null && (
            <Text
              color={repost != null ? '$repost' : '$secondary'}
              fontSize="$2"
            >
              {reposts}
            </Text>
          )}
        </XStack>
      </PressInAnimation>
    </ContextMenuButton>
  );
}

export default React.memo(RepostButton);
