import React, { useMemo, useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { usePersonQuery } from '@src/api/queries/bsky/usePersonQuery';
import { Tabs } from 'react-native-collapsible-tab-view';
import ProfilePostsTab from '@src/components/Profile/components/ProfilePostsTab';
import { useTheme } from 'tamagui';
import ProfileInfo from '@src/components/Profile/components/ProfileInfo';
import LoadingOverlay from '@src/components/Common/Loading/LoadingOverlay';
import TopTabs from '@src/components/Common/TopTabs/TopTabs';
import { useClient } from '@root/App';

// NOTICE
// On November 15th, 2023, this code worked on the first try.

// NOTICE
// Copilot suggested this snippet after I typed the above notice. Is it trying to tell me something?
// "I'm not sure if it still works, but I'm not going to try it again."

export default function ProfileScreen({
  navigation,
  route,
}: NativeStackScreenProps<MainStackParamList, 'Profile'>): React.JSX.Element {
  const client = useClient();

  const theme = useTheme();

  const pagerViewRef = useRef(null);

  const { personOrUri } = route.params;

  const { isFetching: isPersonLoading, data: person } = usePersonQuery({
    client,
    personOrId: personOrUri,
  });

  const ownId = useMemo(() => client.getUserId(), [client]);

  if (isPersonLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Tabs.Container
      renderTabBar={() => (
        <TopTabs
          tabs={[
            { name: 'Posts' },
            { name: 'Replies' },
            { name: 'Media' },
            ...(ownId === person?.id ? [{ name: 'Likes' }] : []),
          ]}
          initialIndex={0}
          pagerViewRef={pagerViewRef}
          justifyTabs="space-between"
        />
      )}
      pagerProps={{
        scrollEnabled: false,
        offscreenPageLimit: 1,
      }}
      // @ts-expect-error TODO Look into this
      headerContainerStyle={{ backgroundColor: theme.bg.val, padding: 0 }}
      renderHeader={() => <ProfileInfo person={person} />}
      ref={pagerViewRef}
    >
      <Tabs.Tab name="Posts">
        <ProfilePostsTab personOrUri={personOrUri} type="posts_no_replies" />
      </Tabs.Tab>
      <Tabs.Tab name="Replies">
        <ProfilePostsTab personOrUri={personOrUri} type="posts_with_replies" />
      </Tabs.Tab>
      <Tabs.Tab name="Media">
        <ProfilePostsTab personOrUri={personOrUri} type="posts_with_media" />
      </Tabs.Tab>

      {ownId === person?.id ? (
        <Tabs.Tab name="Likes">
          <ProfilePostsTab personOrUri={personOrUri} type="likes" />
        </Tabs.Tab>
      ) : null}
    </Tabs.Container>
  );
}
