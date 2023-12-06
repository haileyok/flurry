import React, { useCallback, useMemo, useState } from 'react';
import { YStack } from 'tamagui';
import {
  refetchNotifications,
  useNotificationsQuery,
} from '@src/api/queries/bsky/useNotificationsQuery';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { INotification } from '@src/types/data';
import FeedLoadingIndicator from '@src/components/Common/Loading/FeedLoadingIndicator';
import RefreshControl from '@src/components/Common/Loading/RefreshControl';
import LikeRepostNotificationItem from '@src/components/Notifications/components/LikeRepostNotificationItem';
import FollowNotificationItem from '@src/components/Notifications/components/FollowNotificationItem';
import ReplyNotificationItem from '@src/components/Notifications/components/ReplyNotificationItem';
import { useFocusEffect } from '@react-navigation/core';
import { useAppStore } from '@src/state/app';
import { useClient } from '@root/App';

const renderItem = ({
  item,
}: ListRenderItemInfo<INotification>): React.JSX.Element => {
  switch (item.type) {
    case 'repost':
    case 'like':
      return <LikeRepostNotificationItem notification={item} />;
    case 'follow':
      return <FollowNotificationItem notification={item} />;
    case 'reply':
      return <ReplyNotificationItem notification={item} />;
    default:
      return <></>;
  }
};

const keyExtractor = (item: INotification, index: number): string => {
  return item.cid + item.createdAt + index.toString();
};

const getItemType = (item: INotification): string => item.type;

export default function NotificationsScreen(): React.JSX.Element {
  const client = useClient();

  const { isFetching, isError, data, fetchNextPage } =
    useNotificationsQuery(client);

  const [isRefetching, setIsRefetching] = useState(false);

  const notifications = useMemo(() => {
    return data?.pages.flatMap((p) => p.notifications) ?? [];
  }, [data]);

  const refetch = useCallback(async () => {
    setIsRefetching(true);

    await refetchNotifications(client);

    void client.markAllRead();

    setIsRefetching(false);
  }, [client]);

  useFocusEffect(
    useCallback(() => {
      // Since we don't want to re-run this too often, we will get the notification count inside of here without the hook
      const unreadCount = useAppStore.getState().unreadCount;

      if (unreadCount > 0) {
        void refetch();
      }
    }, [refetch]),
  );

  return (
    <YStack flex={1}>
      <FlashList<INotification>
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={notifications}
        estimatedItemSize={150}
        getItemType={getItemType}
        onEndReached={fetchNextPage}
        ListFooterComponent={
          <FeedLoadingIndicator
            isLoading={isFetching}
            isError={isError}
            isEmpty={notifications.length < 1}
            retry={refetch}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching || isRefetching}
            onRefresh={refetch}
          />
        }
      />
    </YStack>
  );
}
