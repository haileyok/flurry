import React, { useCallback, useEffect } from 'react';
import { IPerson } from '@src/types/data';
import { useNav } from '@src/hooks/useNav';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import ProfileHeader from '@src/components/Profile/components/ProfileHeader';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import { Text, XStack, YStack } from 'tamagui';
import Localize from '@src/lib/localize/Localize';
import Pluralize from '@src/lib/pluralize/Pluralize';
import FollowButton from '@src/components/Common/Button/FollowButton';
import { useRichTextElements } from '@src/hooks/useRichTextElements';
import Chip from '@src/components/Common/BlahBlahBlah/Chip';

interface IProps {
  person?: IPerson;
}

function ProfileInfo({ person }: IProps): React.JSX.Element {
  const navigation = useNav<MainStackParamList>();
  const scrollOffset = useCurrentTabScrollY();

  const richTextElements = useRichTextElements(
    person?.description,
    person?.facets,
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <ProfileHeader person={person} scrollOffset={scrollOffset} />
      ),
    });
  }, [navigation, person, scrollOffset]);

  const onFollowersPress = useCallback(() => {
    if (person?.id == null) return;

    navigation.push('PersonList', {
      type: 'followers',
      uri: person.id,
    });
  }, [navigation, person?.id]);

  const onFollowingPress = useCallback(() => {
    if (person?.id == null) return;

    navigation.push('PersonList', {
      type: 'following',
      uri: person.id,
    });
  }, [navigation, person?.id]);

  return (
    <YStack
      backgroundColor="$bg"
      paddingVertical="$4"
      paddingHorizontal="$3"
      pointerEvents="box-none"
    >
      <XStack flexShrink={1} marginLeft="auto" marginRight="$3" space="$3">
        <YStack alignItems="center" onPress={onFollowersPress} hitSlop={3}>
          <Localize count={person?.followers} fontSize="$5" fontWeight="bold" />
          <Pluralize single="Follower" count={person?.followers} />
        </YStack>
        <YStack alignItems="center" onPress={onFollowingPress} hitSlop={3}>
          <Localize count={person?.following} fontSize="$5" fontWeight="bold" />
          <Text>Following</Text>
        </YStack>
        <YStack alignItems="center" pointerEvents="none">
          <Localize count={person?.posts} fontSize="$5" fontWeight="bold" />
          <Pluralize single="Post" count={person?.posts} />
        </YStack>
      </XStack>
      <XStack marginTop="$4" pointerEvents="box-none">
        <YStack flex={1} pointerEvents="none">
          <Text fontSize="$5" fontWeight="bold" numberOfLines={1}>
            {person?.displayName}
          </Text>
          <Text fontSize="$2" color="$secondary" numberOfLines={1}>
            @{person?.handle}
          </Text>
        </YStack>
        <FollowButton
          isFollowing={person!.isFollowing}
          followingUri={person!.followingUri}
          id={person!.id}
          floatRight
        />
      </XStack>
      <XStack space="$2">
        {person?.followedBy === true && (
          <Chip label="Follows You" backgroundColor="$accent" marginTop="$2" />
        )}
        {person?.blockedBy === true && (
          <Chip label="Blocks You" backgroundColor="$danger" marginTop="$2" />
        )}
        {person?.blockedBy === true && (
          <Chip label="Mutes You" backgroundColor="$danger" marginTop="$2" />
        )}
      </XStack>
      <Text marginTop="$4" fontSize="$3" pointerEvents="none">
        {richTextElements}
      </Text>
    </YStack>
  );
}

export default React.memo(ProfileInfo);
