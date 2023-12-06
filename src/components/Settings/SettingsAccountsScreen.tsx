import React, { useEffect } from 'react';
import { ScrollView } from 'tamagui';
import { Table } from '@src/lib/table';
import { removeAccount, useAccounts } from '@src/state/account';
import { Image } from 'expo-image';
import { useNav } from '@src/hooks';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import MainButton from '@src/components/Common/Button/MainButton';
import { Alert } from 'react-native';

export default function SettingsAccountsScreen(): React.JSX.Element {
  const navigation = useNav<MainStackParamList>();

  const accounts = useAccounts();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MainButton
          label="Add Account"
          highlight
          onPress={() => navigation.push('AddAccount', { basic: true })}
        />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Accounts">
          {accounts.map((a) => (
            <Table.Cell
              key={a.handle}
              label={a.displayName ?? a.handle}
              subtitle={a.host}
              labelStyle="large"
              accessoryLeft={
                <Image
                  source={a.avatar}
                  style={{ height: 40, width: 40, borderRadius: 100 }}
                />
              }
              chevron
              onPress={() =>
                Alert.alert(
                  'Remove Account',
                  'Are you sure you want to remove this account from your saved accounts?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Remove',
                      style: 'destructive',
                      onPress: () => removeAccount(a),
                    },
                  ],
                )
              }
            />
          ))}
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}
