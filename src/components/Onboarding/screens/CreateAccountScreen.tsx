import React from 'react';
import { ScrollView, Spacer, Text, View } from 'tamagui';
import InputGroup from '@src/components/Common/Input/InputGroup';
import { Key, Lock, Mail, Server, UserCircle } from '@tamagui/lucide-icons';
import { useCreateAccount } from '@src/components/Onboarding/hooks/useCreateAccount';
import FullButton from '@src/components/Common/Button/FullButton';
import ServiceSelect from '@src/components/Onboarding/components/ServiceSelect';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { useAvoidSoftView } from '@src/hooks/useAvoidSoftView';

export default function CreateAccountScreen(): React.JSX.Element {
  const createAccount = useCreateAccount();

  useAvoidSoftView();

  return (
    <AvoidSoftInputView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        paddingVertical="$6"
        paddingHorizontal="$3"
        space="$3"
        flexDirection="column"
      >
        <Text fontSize="$7" fontWeight="bold">
          Just moments from posting...
        </Text>
        <Text fontSize="$3" fontWeight="bold" marginTop={-10}>
          Create an account to get started!
        </Text>
        <Spacer />
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
        <InputGroup
          label="Email"
          name="email"
          placeholder="Email"
          Icon={() => <Mail size="$1" />}
          onTextChange={createAccount.onInputChange}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
        />
        {createAccount.form.serviceType === 'bsky' && (
          <InputGroup
            label="Invite Code"
            name="inviteCode"
            placeholder="Invite Code"
            Icon={() => <Key size="$1" />}
            onTextChange={createAccount.onInputChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        <InputGroup
          label="Password"
          name="password"
          placeholder="Password"
          Icon={() => <Lock size="$1" />}
          onTextChange={createAccount.onInputChange}
          autoCapitalize="none"
          autoComplete="new-password"
          autoCorrect={false}
          keyboardType="default"
          secureTextEntry
        />
        <Spacer size="$1" />
        <FullButton label="Create Account" onPress={createAccount.onSubmit} />
      </ScrollView>
    </AvoidSoftInputView>
  );
}
