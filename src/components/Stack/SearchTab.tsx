import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabScreens from '@src/components/Stack/MainTabScreens';
import SearchScreen from '@src/components/Search/SearchScreen';

const Stack = createNativeStackNavigator();

export default function SearchTab(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
      {MainTabScreens({ Stack })}
    </Stack.Navigator>
  );
}
