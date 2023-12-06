import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedTab from '@src/components/Stack/FeedTab';
import SearchTab from '@src/components/Stack/SearchTab';
import AlertsTab from '@src/components/Stack/AlertsTab';
import ProfileTab from '@src/components/Stack/ProfileTab';
import { Bell, Home, PencilLine, Search, User } from '@tamagui/lucide-icons';
import { Image } from 'expo-image';
import { setDrawerOpen, useUnreadCount } from '@src/state/app';
import { useTheme } from 'tamagui';
import { useSelfQuery } from '@src/api/queries/bsky/usePersonQuery';
import { useClient } from '@root/App';

// Create the tabs for the account
const MainTabs = createBottomTabNavigator();

interface IProfileIconProps {
  color: string;
  size: number;
}

// A little hack for the new post tab
const EmptyComponent = (): null => null;

// The icon to render for the profile
const ProfileIcon = ({ color, size }: IProfileIconProps): React.JSX.Element => {
  const client = useClient();
  const { data: profile } = useSelfQuery(client);

  if (profile?.avatar == null) {
    return <User color={color} size={size} />;
  }
  return (
    <Image
      source={profile?.avatar}
      style={{
        width: size + 6,
        height: size + 6,
        borderRadius: 100,
      }}
    />
  );
};

const onHomeTabLongPress = (): void => {
  setDrawerOpen('left', true);
};

export default function MainTabNavigator(): React.JSX.Element {
  const theme = useTheme();

  const unreadCount = useUnreadCount();
  // We want to keep track of the selected tab so that we can properly navigate to the modal screen
  const selectedTab = useRef('FeedTab');

  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          paddingBottom: 15,
        },
      }}
    >
      <MainTabs.Screen
        name="FeedTab"
        component={FeedTab}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => <Home color={color} size={28} />,
        }}
        listeners={{
          tabLongPress: onHomeTabLongPress,
          focus: () => (selectedTab.current = 'FeedTab'),
        }}
      />
      <MainTabs.Screen
        name="SearchTab"
        component={SearchTab}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => <Search color={color} size={28} />,
        }}
        listeners={{
          focus: () => (selectedTab.current = 'SearchTab'),
        }}
      />
      <MainTabs.Screen
        name="NewPostTab"
        component={EmptyComponent}
        options={{
          tabBarLabel: 'New Post',
          tabBarIcon: ({ color, size }) => (
            <PencilLine color={color} size={28} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(selectedTab.current, {
              screen: 'NewPost',
            });
          },
        })}
      />
      <MainTabs.Screen
        name="AlertsTab"
        component={AlertsTab}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={28} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.accent.val as string,
            top: -15,
          },
        }}
        listeners={{
          focus: () => (selectedTab.current = 'AlertsTab'),
        }}
      />
      <MainTabs.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon color={color} size={size} />
          ),
        }}
        listeners={{
          focus: () => (selectedTab.current = 'ProfileTab'),
        }}
      />
    </MainTabs.Navigator>
  );
}
