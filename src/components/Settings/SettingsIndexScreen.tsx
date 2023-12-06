import React, { useState } from 'react';
import { ScrollView } from 'tamagui';
import { Table } from '@src/lib/table';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import * as Application from 'expo-application';
import TableAccessoryIcon from '@src/lib/table/TableAccessoryIcon';
import {
  Bell,
  Cog,
  HandMetal,
  Info,
  Paintbrush,
  UserCircle,
} from '@tamagui/lucide-icons';
import { useImageCacheInfo } from '@src/hooks/useImageCacheInfo';

export default function SettingsIndexScreen({
  navigation,
}: NativeStackScreenProps<
  MainStackParamList,
  'SettingsIndex'
>): React.JSX.Element {
  const [taps, setTaps] = useState(0);

  const { cacheSize, clearImageCache } = useImageCacheInfo();

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section>
          <Table.Cell
            label="General"
            chevron
            accessoryLeft={<TableAccessoryIcon Icon={Cog} color="#E50000" />}
            onPress={() => navigation.navigate('SettingsGeneral')}
          />
          <Table.Cell
            label="Appearance"
            chevron
            accessoryLeft={
              <TableAccessoryIcon Icon={Paintbrush} color="#FF8D00" />
            }
            onPress={() => navigation.navigate('SettingsAppearance')}
          />
          <Table.Cell
            label="Gestures"
            chevron
            accessoryLeft={
              <TableAccessoryIcon Icon={HandMetal} color="#d4cd11" />
            }
            onPress={() => navigation.navigate('SettingsGestures')}
          />
          <Table.Cell
            label="Notifications"
            chevron
            accessoryLeft={<TableAccessoryIcon Icon={Bell} color="#028121" />}
            onPress={() => navigation.navigate('SettingsNotifications')}
          />
          <Table.Cell
            label="Accounts"
            chevron
            accessoryLeft={
              <TableAccessoryIcon Icon={UserCircle} color="#004CFF" />
            }
            onPress={() => navigation.navigate('SettingsAccounts')}
          />
          <Table.Cell
            label="About"
            chevron
            accessoryLeft={<TableAccessoryIcon Icon={Info} color="#770088" />}
            onPress={() => navigation.navigate('SettingsAbout')}
          />
        </Table.Section>
        <Table.Section
          header="Info"
          footer={
            'The image cache includes user avatars, banners, and some images from posts. It is automtically managed, and images that have not been accessed in the last seven days will be purged from the cache.\n\nA large cache is not something to be concerned about, unless you are in urgent need of disk space. For the best experience, it is not recommended that you manually clear this cache, however, you may do so if you wish.'
          }
        >
          <Table.Cell
            label="Version"
            rightLabel={`${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}
            onPress={() => setTaps((prev) => prev + 1)}
          />
          <Table.Cell label="Image Cache Size" rightLabel={cacheSize} />
          <Table.Cell
            label="Clear Image Cache"
            chevron
            onPress={clearImageCache}
          />
        </Table.Section>
        {taps > 5 && (
          <Table.Section header="Debug">
            <Table.Cell
              label="Debug Log"
              chevron
              onPress={() => navigation.navigate('SettingsLog')}
            />
          </Table.Section>
        )}
      </Table.Container>
    </ScrollView>
  );
}
