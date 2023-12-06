import React, { useCallback } from 'react';
import { Text, XStack } from 'tamagui';
import Avatar from '@src/components/Common/Profile/Avatar';
import { IPerson } from '@src/types/data';
import TimeFrom from '@src/components/Common/TimeFrom/TimeFrom';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { useNav } from '@src/hooks';

interface IProps {
  person: IPerson | undefined;
  createdAt: string | undefined;
}

/**
 * Post header for embedded posts.
 * @param {IPerson | undefined} person
 * @param {string | undefined} createdAt
 * @returns {React.JSX.Element | null}
 * @constructor
 */
export default function CompactPostHeader({
  person,
  createdAt,
}: IProps): React.JSX.Element | null {
  const navigation = useNav<MainStackParamList>();

  const onPress = useCallback(() => {
    navigation.push('Profile', {
      personOrUri: person!,
    });
  }, [navigation, person]);

  if (person == null) return null;

  return (
    <XStack space="$2" alignItems="center" marginBottom="$1.5">
      <Avatar person={person} size={26} pressAction="profile" />
      <Text flex={1} numberOfLines={1} space="$2">
        <Text fontSize="$3" fontWeight="bold" onPress={onPress} hitSlop={10}>
          {person.displayName ?? person.handle}
        </Text>
        <Text fontSize="$2" color="$secondary" onPress={onPress} hitSlop={10}>
          @{person.handle}
        </Text>
      </Text>
      <TimeFrom timestamp={createdAt} />
    </XStack>
  );
}
