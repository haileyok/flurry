import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import Avatar from '@src/components/Common/Profile/Avatar';
import { IPerson } from '@src/types/data';
import FollowButton from '@src/components/Common/Button/FollowButton';

interface IProps {
  person: IPerson;
  type: 'compact' | 'full';
}

/**
 * A simple card for displaying a person's information. Memoized since this is mainly used in lists.
 * @param {IPerson} person
 * @param {'compact' | 'full'} type - The type of card to render. Defaults to `compact`.
 * @returns {React.JSX.Element}
 * @constructor
 */
function PersonCard({ person, type = 'compact' }: IProps): React.JSX.Element {
  return (
    <YStack
      space="$3"
      padding="$3"
      paddingBottom="$4"
      backgroundColor="$bg"
      flex={1}
    >
      <XStack space="$2.5" flex={1}>
        <Avatar person={person} size={42} pressAction="profile" />
        <YStack flex={1} flexShrink={1}>
          <Text fontSize="$3" fontWeight="bold" flex={1} numberOfLines={1}>
            {person.displayName ?? person.handle}
          </Text>
          <Text fontSize="$2" color="$secondary" flex={1} numberOfLines={1}>
            @{person.handle}
          </Text>
        </YStack>
        <FollowButton
          id={person.id}
          isFollowing={person.isFollowing}
          followingUri={person.followingUri}
        />
      </XStack>
      {person.description != null && (
        <Text flex={1} numberOfLines={3} fontSize="$3">
          {person.description}
        </Text>
      )}
    </YStack>
  );
}

export default React.memo(PersonCard);
