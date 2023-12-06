import React from 'react';
import { INotification } from '@src/types/data';
import { YStack } from 'tamagui';
import CardIndicator from '@src/components/Common/BlahBlahBlah/CardIndicator';
import FeedPost from '@src/components/Common/Post/postTypes/FeedPost';

interface IProps {
  notification: INotification;
}

function ReplyNotificationItem({ notification }: IProps): React.JSX.Element {
  const { isRead, record } = notification;

  return (
    <YStack borderBottomWidth={1} borderBottomColor="$border">
      <CardIndicator visible={!isRead} color="$accent" />
      <FeedPost post={record!} />
    </YStack>
  );
}

export default React.memo(ReplyNotificationItem);
