import React from 'react';
import { YStack } from 'tamagui';
import { Table } from '@src/lib/table';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { setSetting } from '@src/state/settings';

export default function SettingsGeneralScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  return (
    <YStack flex={1}>
      <Table.Container>
        <Table.Section header="Web Browser">
          <Table.Cell
            label="Open Links in Default Browser"
            switchValue={settings.useDefaultBrowser}
            onSwitchValueChange={(value) =>
              setSetting('useDefaultBrowser', value)
            }
          />
          <Table.Cell
            label="Use Reader Mode"
            switchValue={settings.useReaderMode}
            onSwitchValueChange={(value) => setSetting('useReaderMode', value)}
          />
        </Table.Section>
      </Table.Container>
    </YStack>
  );
}
