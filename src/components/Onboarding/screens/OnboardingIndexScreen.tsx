import React from 'react';
import { Separator, Spacer, Text, Theme, XStack, YStack } from 'tamagui';
import { ImageBackground } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullButton from '@src/components/Common/Button/FullButton';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '@src/types/navigation/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const background = require('../../../../assets/onboardingBackground.jpg');

export default function OnboardIndexScreen({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  'Onboarding'
>): React.JSX.Element {
  return (
    <ImageBackground source={background} style={{ flex: 1 }} blurRadius={20}>
      <Theme name="dark">
        <StatusBar style="light" />
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <YStack
            flex={1}
            alignItems="center"
            justifyContent="space-between"
            marginVertical={80}
          >
            <Text fontSize="$11" fontWeight="bold">
              Flurry
            </Text>
            <YStack
              alignItems="center"
              justifyContent="center"
              space="$3"
              width="80%"
            >
              <FullButton
                label="Create an Account"
                onPress={() => navigation.navigate('CreateAccount')}
                width="100%"
              />
              <FullButton
                label="Sign In"
                onPress={() => {
                  navigation.navigate('AddAccount');
                }}
                backgroundColor="transparent"
                width="100%"
              />
              <Spacer size={1} />
              <XStack alignItems="center" justifyContent="center" space="$3">
                <Separator
                  borderBottomWidth={1}
                  borderColor="white"
                  width="100%"
                />
                <Text fontSize="$2">OR</Text>
                <Separator
                  borderBottomWidth={1}
                  borderColor="white"
                  width="100%"
                />
              </XStack>
              <XStack space="$3">
                <FullButton
                  label="Learn More"
                  onPress={() => {}}
                  backgroundColor="transparent"
                  borderColor="transparent"
                />
                <FullButton
                  label="Privacy Policy"
                  onPress={() => {}}
                  backgroundColor="transparent"
                  borderColor="transparent"
                />
              </XStack>
            </YStack>
          </YStack>
        </SafeAreaView>
      </Theme>
    </ImageBackground>
  );
}
