import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardIndexScreen from '@src/components/Onboarding/screens/OnboardingIndexScreen';
import CreateAccountScreen from '@src/components/Onboarding/screens/CreateAccountScreen';
import AddAccountScreen from '@src/components/Onboarding/screens/AddAccountScreen';
import { useAccounts } from '@src/state/account';
import MainTabNavigator from '@src/components/Stack/MainTabNavigator';

const RootStack = createNativeStackNavigator();

export default function Stack(): React.JSX.Element {
  const accounts = useAccounts();

  return (
    <RootStack.Navigator>
      {accounts.length === 0 ? (
        <RootStack.Group>
          <RootStack.Screen
            name="Onboarding"
            component={OnboardIndexScreen}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="CreateAccount"
            component={CreateAccountScreen}
            options={{
              headerTitle: 'Create an Account',
              headerBackTitle: 'Back',
              presentation: 'modal',
            }}
          />
          <RootStack.Screen
            name="AddAccount"
            component={AddAccountScreen}
            options={{
              headerTitle: 'Add an Account',
              headerBackTitle: 'Back',
              presentation: 'modal',
            }}
          />
        </RootStack.Group>
      ) : (
        <RootStack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <RootStack.Screen name="Tabs" component={MainTabNavigator} />
        </RootStack.Group>
      )}
    </RootStack.Navigator>
  );
}
