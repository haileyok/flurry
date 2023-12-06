import React from 'react';
import { ScrollView, Spacer, Text, View, YStack } from 'tamagui';
import InputGroup from '@src/components/Common/Input/InputGroup';
import { Lock, Server, UserCircle } from '@tamagui/lucide-icons';
import ServiceSelect from '@src/components/Onboarding/components/ServiceSelect';
import { useAddAccount } from '@src/components/Onboarding/hooks/useAddAccount';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import MainButton from '@src/components/Common/Button/MainButton';
import { useRoute } from '@react-navigation/core';

export default function AddAccountScreen(): React.JSX.Element {
  const createAccount = useAddAccount();

  const { basic } = (useRoute().params as { basic: boolean }) ?? {};

  return (
    <AvoidSoftInputView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        paddingVertical="$6"
        paddingHorizontal="$3"
        space="$3"
        flexDirection="column"
      >
        {!basic && (
          <YStack space="$3">
            <Text fontSize="$7" fontWeight="bold">
              Just moments from posting...
            </Text>
            <Text fontSize="$3" fontWeight="bold" marginTop={-10}>
              Sign in to get started!
            </Text>
            <Spacer />
          </YStack>
        )}
        <View>
          <ServiceSelect
            selection={createAccount.form.serviceType}
            onSelectionChange={(v) => {
              createAccount.onInputChange(v, 'serviceType');
            }}
          />
        </View>

        <InputGroup
          label="Host"
          name="host"
          placeholder="example.com"
          Icon={() => <Server size="$1" />}
          onTextChange={createAccount.onInputChange}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        {createAccount.form.serviceType === 'bsky' && (
          <InputGroup
            label="Username"
            name="username"
            placeholder="Username"
            Icon={() => <UserCircle size="$1" />}
            onTextChange={createAccount.onInputChange}
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect={false}
            keyboardType="default"
          />
        )}
        {createAccount.form.serviceType === 'bsky' && (
          <InputGroup
            label="Password"
            name="password"
            placeholder="Password"
            Icon={() => <Lock size="$1" />}
            onTextChange={createAccount.onInputChange}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            keyboardType="default"
            secureTextEntry
          />
        )}
        <Spacer size="$1" />
        <MainButton
          label="Sign In"
          highlight
          fontSize="$4"
          onPress={createAccount.onSubmit}
        />
      </ScrollView>
    </AvoidSoftInputView>
  );
}
