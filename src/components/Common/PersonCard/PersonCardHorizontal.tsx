import React from 'react';
import { IPerson } from '@src/types/data';
import { Text, XStack, YStack } from 'tamagui';
import Avatar from '@src/components/Common/Profile/Avatar';
import { useNav, useRichTextElements } from '@src/hooks';
import MainButton from '@src/components/Common/Button/MainButton';
import FollowButton from '@src/components/Common/Button/FollowButton';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';

interface IProps {
  person: IPerson;
}

function PersonCardHorizontal({ person }: IProps): React.JSX.Element {
  const navigation = useNav<MainStackParamList>();

  const richTextElements = useRichTextElements(
    person.description,
    person.facets,
  );

  return (
    <YStack
      width={230}
      margin="$1.5"
      borderRadius="$2"
      padding="$2"
      flex={1}
      space="$2"
    >
      <XStack space="$3" flex={1}>
        <Avatar person={person} size={32} pressAction="profile" />
        <YStack flex={1}>
          <Text fontSize="$3" fontWeight="bold" numberOfLines={1} flex={1}>
            {person.displayName ?? person.handle}
          </Text>
          <Text fontSize="$2" numberOfLines={1} color="$secondary" flex={1}>
            @{person.handle}
          </Text>
        </YStack>
      </XStack>
      <XStack justifyContent="space-evenly" space="$2" flex={1}>
        <MainButton
          label="View Profile"
          onPress={() =>
            navigation.push('Profile', {
              personOrUri: person,
            })
          }
        />
        <FollowButton
          id={person.id}
          isFollowing={person.isFollowing}
          followingUri={person.followingUri}
        />
      </XStack>
      <Text numberOfLines={4} flex={1}>
        {richTextElements}
      </Text>
    </YStack>
  );
}

export default React.memo(PersonCardHorizontal);
