import React from 'react';
import { useTheme, XStack, YStack } from 'tamagui';
import { INotification } from '@src/types/data';
import { UserPlus } from '@tamagui/lucide-icons';
import CardIndicator from '@src/components/Common/BlahBlahBlah/CardIndicator';
import NotificationCreatorAvatars from '@src/components/Notifications/components/NotificationCreatorAvatars';

interface IProps {
  notification: INotification;
}

function FollowNotificaitonItem({ notification }: IProps): React.JSX.Element {
  const theme = useTheme();
  const { type, creators, isRead, createdAt } = notification;

  return (
    <XStack
      backgroundColor="$bg"
      paddingVertical="$2.5"
      paddingHorizontal="$3"
      space="$3"
      borderBottomWidth={1}
      borderBottomColor="$border"
    >
      <CardIndicator visible={!isRead} color="$accent" />
      <YStack width="$3" alignItems="flex-end">
        <UserPlus
          size={28}
          color={theme.accent.val as string}
          fill={theme.accent.val as string}
        />
      </YStack>
      <YStack flex={1} space="$1">
        <NotificationCreatorAvatars
          creators={creators}
          type={type}
          createdAt={createdAt}
          message="followed you"
        />
      </YStack>
    </XStack>
  );
}

export default React.memo(FollowNotificaitonItem);
