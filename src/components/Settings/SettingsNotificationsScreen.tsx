import React from 'react';
import { YStack } from 'tamagui';
import { Table } from '@src/lib/table';
import { setSetting, useSettingsStore } from '@src/state/settings';
import { useNotifications } from '@src/hooks/useNotifications';
import LoadingOverlay from '@src/components/Common/Loading/LoadingOverlay';

export default function SettingsNotificationsScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  const { isLoading, enable, disable } = useNotifications();

  return (
    <YStack flex={1}>
      <LoadingOverlay visible={isLoading} />
      <Table.Container>
        <Table.Section header="Notifications">
          <Table.Cell
            label="Enable Notifications"
            switchValue={settings.notificationsEnabled}
            onSwitchValueChange={async (v) => {
              if (v) {
                await enable();
                setSetting('notificationsEnabled', true);
              } else {
                await disable();
                setSetting('notificationsEnabled', false);
              }
            }}
          />
        </Table.Section>
      </Table.Container>
    </YStack>
  );
}
