import React from 'react';
import { setSetting, useSettingsStore } from '@src/state/settings';
import { YStack } from 'tamagui';
import { Table } from '@src/lib/table';

export default function SettingsAppearanceScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  return (
    <YStack flex={1}>
      <Table.Container>
        <Table.Section>
          <Table.Cell
            label="Use System Theme"
            switchValue={settings.followSystemScheme}
            onSwitchValueChange={(v) => setSetting('followSystemScheme', v)}
          />
        </Table.Section>
        <Table.Section
          header="Thread Apperance"
          footer="Incase you do not wish to use threaded mode on the BlueSky web app, this setting does not affect your BlueSky account preferences."
        >
          <Table.Cell
            label="Threaded Mode"
            switchValue={settings.threadedMode}
            onSwitchValueChange={(v) => setSetting('threadedMode', v)}
          />
        </Table.Section>
      </Table.Container>
    </YStack>
  );
}
