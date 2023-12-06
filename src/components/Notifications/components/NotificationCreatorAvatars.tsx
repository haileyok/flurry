import React, { useMemo } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import Avatar from '@src/components/Common/Profile/Avatar';
import Pluralize from '@src/lib/pluralize/Pluralize';
import TimeFrom from '@src/components/Common/TimeFrom/TimeFrom';
import { IPerson, NotificationType } from '@src/types/data';

interface IProps {
  creators: IPerson[];
  type: NotificationType;
  createdAt: string;
  message: string;
}

export default function NotificationCreatorAvatars({
  creators,
  type,
  createdAt,
  message,
}: IProps): React.JSX.Element {
  const totalCreators = useMemo(() => creators.length, [creators]);

  return (
    <YStack space="$2">
      <XStack space="$2">
        {creators.slice(0, 6).map((creator, i) => {
          return (
            <Avatar size={34} person={creator} key={i} pressAction="profile" />
          );
        })}
      </XStack>
      <XStack>
        <Text fontSize="$3" flex={1}>
          <Text fontWeight="bold">{creators[0].displayName}</Text>
          {totalCreators > 1 && (
            <>
              <Text> and </Text>
              <Text fontWeight="bold">
                {totalCreators - 1}
                <Pluralize single=" other" count={totalCreators - 1} />
              </Text>
            </>
          )}
          <Text>
            {' '}
            {type}
            {type === 'like' ? 'd' : 'ed'} {message}
          </Text>
        </Text>
        <TimeFrom timestamp={createdAt} />
      </XStack>
    </YStack>
  );
}
