import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabScreens from '@src/components/Stack/MainTabScreens';
import NotificationsScreen from '@src/components/Notifications/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function AlertsTab(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      {MainTabScreens({ Stack })}
    </Stack.Navigator>
  );
}
