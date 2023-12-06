import React from 'react';
import { ScrollView } from 'tamagui';
import { Table } from '@src/lib/table';
import { setSetting, useSettingsStore } from '@src/state/settings';

export default function SettingsGesturesScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Main FAB">
          <Table.Cell
            label="Main Floating Button"
            switchValue={settings.mainFabEnabled}
            onSwitchValueChange={(v) => setSetting('mainFabEnabled', v)}
          />
        </Table.Section>
        <Table.Section header="Secondary FAB">
          <Table.Cell
            label="Secondary Floating Button"
            switchValue={settings.secondaryFabEnabled}
            onSwitchValueChange={(v) => setSetting('secondaryFabEnabled', v)}
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}
