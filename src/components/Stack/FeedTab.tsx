import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabScreens from '@src/components/Stack/MainTabScreens';
import HomeScreen from '@src/components/Feed/HomeScreen';
import { Pressable } from 'react-native';
import { setDrawerOpen } from '@src/state/app';
import { List, UserCircle } from '@tamagui/lucide-icons';
import { Image } from 'expo-image';
import { useSelfQuery } from '@src/api/queries/bsky/usePersonQuery';
import { useClient } from '@root/App';

const Stack = createNativeStackNavigator();

const onLeftDrawerButtonPress = (): void => {
  setDrawerOpen('left', true);
};

const onRightDrawerButtonPress = (): void => {
  setDrawerOpen('right', true);
};

function HeaderRightIcon(): React.JSX.Element {
  const client = useClient();
  const { data: profile } = useSelfQuery(client);

  if (profile?.avatar == null) {
    return (
      <Pressable onPress={onRightDrawerButtonPress}>
        <UserCircle color="$accent" size={28} />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onRightDrawerButtonPress}>
      <Image
        source={profile?.avatar}
        style={{
          width: 30,
          height: 30,
          borderRadius: 100,
        }}
      />
    </Pressable>
  );
}

export default function FeedTab(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: () => (
            <Pressable onPress={onLeftDrawerButtonPress}>
              <List color="$accent" />
            </Pressable>
          ),
          headerRight: () => <HeaderRightIcon />,
        }}
      />
      {MainTabScreens({ Stack })}
    </Stack.Navigator>
  );
}
