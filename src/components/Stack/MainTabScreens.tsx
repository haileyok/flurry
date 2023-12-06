import React from 'react';
import { NativeStackNavigatorProps } from 'react-native-screens/lib/typescript/native-stack/types';
import {
  ParamListBase,
  StackNavigationState,
  TypedNavigator,
} from '@react-navigation/native';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import PostScreen from '@src/components/Post/PostScreen';
import ProfileScreen from '@src/components/Profile/ProfileScreen';
import NewPostScreen from '@src/components/NewPost/NewPostScreen';
import PersonListScreen from '@src/components/Lists/PersonListScreen';
import FeedScreen from '@src/components/Feed/FeedScreen';
import SettingsIndexScreen from '@src/components/Settings/SettingsIndexScreen';
import SettingsGeneralScreen from '@src/components/Settings/SettingsGeneralScreen';
import SettingsNotificationsScreen from '@src/components/Settings/SettingsNotificationsScreen';
import SettingsAppearanceScreen from '@src/components/Settings/SettingsAppearanceScreen';
import SettingsGesturesScreen from '@src/components/Settings/SettingsGesturesScreen';
import FeedsListScreen from '@src/components/Lists/FeedsListScreen';
import SettingsLogScreen from '@src/components/Settings/SettingsLogScreen';
import { useSelfQuery } from '@src/api/queries/bsky/usePersonQuery';
import { useClient } from '@root/App';
import SettingsAccountsScreen from '@src/components/Settings/SettingsAccountsScreen';
import AddAccountScreen from '@src/components/Onboarding/screens/AddAccountScreen';

interface IProps {
  Stack: TypedNavigator<
    ParamListBase,
    StackNavigationState<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap,
    ({
      id,
      initialRoutename,
      children,
      screenListeners,
      screenOptions,
      ...rest
    }: NativeStackNavigatorProps) => JSX.Element
  >;
}

export default function MainTabScreens({ Stack }: IProps): React.JSX.Element {
  const client = useClient();
  const { data: profile } = useSelfQuery(client);

  return (
    <>
      <Stack.Group>
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen
          name="PersonList"
          component={PersonListScreen}
          options={{ headerTitle: 'Person List' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
          initialParams={{
            personOrUri: profile,
          }}
        />
        <Stack.Screen
          name="FeedsList"
          component={FeedsListScreen}
          options={{
            title: 'Feeds',
          }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ animation: 'slide_from_bottom' }}>
        <Stack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{
            headerTitle: 'New Post',
          }}
        />
      </Stack.Group>

      {/* Settings Screens */}
      <Stack.Group>
        <Stack.Screen
          name="AddAccount"
          component={AddAccountScreen}
          options={{
            headerTitle: 'Add an Account',
            headerBackTitle: 'Back',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="SettingsIndex"
          component={SettingsIndexScreen}
          options={{ headerTitle: 'Settings' }}
        />
        <Stack.Screen
          name="SettingsGeneral"
          component={SettingsGeneralScreen}
          options={{
            headerTitle: 'General',
          }}
        />
        <Stack.Screen
          name="SettingsNotifications"
          component={SettingsNotificationsScreen}
          options={{ headerTitle: 'Notifications' }}
        />
        <Stack.Screen
          name="SettingsAppearance"
          component={SettingsAppearanceScreen}
          options={{ headerTitle: 'Appearance' }}
        />
        <Stack.Screen
          name="SettingsGestures"
          component={SettingsGesturesScreen}
          options={{ headerTitle: 'Gestures' }}
        />
        <Stack.Screen
          name="SettingsLog"
          component={SettingsLogScreen}
          options={{ headerTitle: 'Log' }}
        />
        <Stack.Screen
          name="SettingsAccounts"
          component={SettingsAccountsScreen}
          options={{ headerTitle: 'Accounts' }}
        />
      </Stack.Group>
    </>
  );
}
