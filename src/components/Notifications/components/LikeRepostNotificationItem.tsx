import React, { useCallback } from 'react';
import { Text, useTheme, XStack, YStack } from 'tamagui';
import { INotification } from '@src/types/data';
import { Heart } from '@tamagui/lucide-icons';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { useNav } from '@src/hooks/useNav';
import CardIndicator from '@src/components/Common/BlahBlahBlah/CardIndicator';
import NotificationCreatorAvatars from '@src/components/Notifications/components/NotificationCreatorAvatars';
import Repost from '@src/components/Common/BlahBlahBlah/Repost';

interface IProps {
  notification: INotification;
}

function LikeRepostNotificationItem({
  notification,
}: IProps): React.JSX.Element {
  const theme = useTheme();
  const navigation = useNav<MainStackParamList>();

  const { type, creators, isRead, createdAt, record } = notification;

  const onPress = useCallback(() => {
    navigation.push('Post', {
      post: record,
    });
  }, [navigation, record]);

  return (
    <XStack
      backgroundColor="$bg"
      paddingVertical="$2.5"
      paddingHorizontal="$3"
      space="$3"
      borderBottomWidth={1}
      borderBottomColor="$border"
      onPress={onPress}
      hitSlop={3}
    >
      <CardIndicator visible={!isRead} color="$accent" />
      <YStack width="$3" alignItems="flex-end">
        {(type === 'like' && (
          <Heart
            size={28}
            color={theme.like.val as string}
            fill={theme.like.val as string}
          />
        )) ||
          (type === 'repost' && <Repost size={28} color={theme.repost.val} />)}
      </YStack>
      <YStack flex={1} space="$1">
        <NotificationCreatorAvatars
          creators={creators}
          type={type}
          createdAt={createdAt}
          message="your post"
        />
        <Text flex={1} numberOfLines={3}>
          {record?.body}
        </Text>
      </YStack>
    </XStack>
  );
}

export default React.memo(LikeRepostNotificationItem);
