import React from 'react';
import { ScrollView, Separator, Text, XStack, YStack } from 'tamagui';
import {
  Cog,
  Hand,
  Hash,
  List,
  Search,
  UserCircle,
  UserCircle2,
} from '@tamagui/lucide-icons';
import { Image } from 'expo-image';
import Localize from '@src/lib/localize/Localize';
import Pluralize from '@src/lib/pluralize/Pluralize';
import { useNavigationRef, useClient } from '@root/App';
import { setDrawerOpen } from '@src/state/app';
import { useSelfQuery } from '@src/api/queries/bsky/usePersonQuery';

function RightDrawer(): React.JSX.Element {
  const navRef = useNavigationRef();

  const client = useClient();

  const { data: profile } = useSelfQuery(client);

  const navigate = (screen: string): void => {
    setDrawerOpen('right', false);
    setTimeout(() => {
      // @ts-expect-error fix this later
      navRef?.navigate(screen);
    }, 150);
  };

  return (
    <ScrollView
      backgroundColor="$fg"
      flex={1}
      paddingVertical={80}
      paddingHorizontal="$4"
      space="$4"
    >
      {profile?.avatar == null ? (
        <UserCircle2 size={75} />
      ) : (
        <Image
          source={profile.avatar}
          style={{
            height: 75,
            width: 75,
            borderRadius: 100,
          }}
        />
      )}
      <YStack space="$1">
        <Text fontSize="$6" fontWeight="bold">
          {profile?.displayName}
        </Text>
        <Text fontSize="$4" color="$secondary">
          @{profile?.handle}
        </Text>
      </YStack>
      <XStack alignItems="center" space="$3">
        <XStack>
          <Localize
            count={profile?.followers}
            fontSize="$3"
            fontWeight="bold"
          />
          <Pluralize single=" Follower" fontSize="$3" />
        </XStack>
        <XStack>
          <Localize
            count={profile?.following}
            fontSize="$3"
            fontWeight="bold"
          />
          <Text fontSize="$3"> Following</Text>
        </XStack>
      </XStack>
      <Separator />
      <YStack flex={1} space="$4">
        <XStack alignItems="center" space="$4">
          <Search size="$2" />
          <Text fontSize="$5">Search</Text>
        </XStack>
        <XStack
          alignItems="center"
          space="$4"
          onPress={() => navigate('FeedsList')}
        >
          <Hash size="$2" />
          <Text fontSize="$5">Feeds</Text>
        </XStack>
        <XStack alignItems="center" space="$4">
          <List size="$2" />
          <Text fontSize="$5">Lists</Text>
        </XStack>
        <XStack alignItems="center" space="$4">
          <Hand size="$2" />
          <Text fontSize="$5">Moderation</Text>
        </XStack>
        <XStack
          alignItems="center"
          space="$4"
          onPress={() => navigate('SettingsIndex')}
        >
          <Cog size="$2" />
          <Text fontSize="$5">Settings</Text>
        </XStack>
        <XStack alignItems="center" space="$4">
          <UserCircle size="$2" />
          <Text fontSize="$5">Accounts</Text>
        </XStack>
      </YStack>
    </ScrollView>
  );
}

export default React.memo(RightDrawer);
