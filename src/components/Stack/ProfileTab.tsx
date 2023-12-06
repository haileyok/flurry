import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabScreens from '@src/components/Stack/MainTabScreens';

const Stack = createNativeStackNavigator();

export default function ProfileTab(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Profile">
      {MainTabScreens({ Stack })}
    </Stack.Navigator>
  );
}
