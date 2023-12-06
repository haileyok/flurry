import React from 'react';
import { IPost } from '@src/types/data';
import { Alert } from 'react-native';
import { IContextMenuActionGroup } from '@src/types/IContextMenuAction';
import ContextMenuButton from '@src/components/Common/Button/ContextMenuButton';
import * as Clipboard from 'expo-clipboard';
import { SFSymbol } from 'sf-symbols-typescript';
import { useThemeScheme } from '@src/hooks';
import { shareLink } from '@src/lib';
import { useClient } from '@root/App';

interface IProps {
  post: IPost;
}

function PostContextButton({ post }: IProps): React.JSX.Element {
  const client = useClient();

  const colorScheme = useThemeScheme();

  const actions: IContextMenuActionGroup[] = [
    {
      key: 'group1',
      actions: [
        {
          label: 'Translate',
          key: 'translate',
          iconName: 'character.book.closed',
          onSelect: () => {
            Alert.alert('Hello');
          },
        },
        {
          label: 'Copy Text',
          key: 'copy',
          iconName: 'doc.on.doc',
          onSelect: () => {
            if (post.body == null) return;

            void Clipboard.setStringAsync(post.body);
          },
        },
        {
          label: 'Share Post',
          key: 'share',
          iconName: 'square.and.arrow.up',
          onSelect: () => {
            void shareLink({
              uri: post.shareLink,
            });
          },
        },
        ...(post.embed?.external?.uri != null
          ? [
              {
                label: 'Share Link',
                key: 'shareLink',
                iconName: 'square.and.arrow.up' as SFSymbol,
                onSelect: () => {
                  void shareLink({
                    uri: post.embed!.external!.uri,
                  });
                },
              },
            ]
          : []),

        ...(client.getUserId() === post.creator?.id
          ? [
              {
                label: 'Delete Post',
                key: 'delete',
                destructive: true,
                iconName: 'trash' as SFSymbol,
                onSelect: () => {
                  Alert.alert(
                    'Delete Post',
                    'Are you sure you want to delete this post?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                          void client.deletePost(post.uri);
                        },
                      },
                    ],
                    {
                      userInterfaceStyle: colorScheme,
                    },
                  );
                },
              },
            ]
          : []),
      ],
    },
    {
      key: 'group2',
      actions: [
        {
          label: 'Moderation',
          key: 'moderation',
          actions: [
            {
              label: 'Report Post',
              key: 'reportPost',
              iconName: 'flag',
              onSelect: () => {
                Alert.alert('Report');
              },
            },
            {
              label: 'Report User',
              key: 'reportUser',
              iconName: 'flag',
              onSelect: () => {
                Alert.alert('Report');
              },
            },
          ],
        },
        {
          label: 'Blocking and Muting',
          key: 'blocking',
          actions: [
            {
              label: 'Block User',
              key: 'blockUser',
              iconName: 'hand.raised',
              onSelect: () => {
                Alert.alert('Report');
              },
            },
            {
              label: 'Mute User',
              key: 'muteUser',
              iconName: 'speaker.slash',
              onSelect: () => {
                Alert.alert('Report');
              },
            },
          ],
        },
      ],
    },
  ];

  return <ContextMenuButton size={20} actions={actions} />;
}

export default React.memo(PostContextButton);
