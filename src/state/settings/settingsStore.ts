import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSelectors } from '@src/state/createSelectors';

export interface SettingsStore {
  // Appearance
  theme: 'light' | 'dark';
  followSystemScheme: boolean;

  threadedMode: boolean;

  // Web Browser
  useDefaultBrowser: boolean;
  useReaderMode: boolean;

  // Notifications
  notificationsEnabled: boolean;

  // Gestures
  mainFabEnabled: boolean;
  mainFabPosition: 'right' | 'left';

  secondaryFabEnabled: boolean;
  secondaryFabPosition: 'right' | 'left';
}

const initialState: SettingsStore = {
  theme: 'light',
  followSystemScheme: true,

  threadedMode: false,

  // Web Browser
  useDefaultBrowser: false,
  useReaderMode: false,

  // Notifications
  notificationsEnabled: false,

  // Gestures
  mainFabEnabled: true,
  mainFabPosition: 'right',

  secondaryFabEnabled: false,
  secondaryFabPosition: 'left',
};

const useSettingsStoreBase = create(
  persist(
    immer<SettingsStore>(() => ({
      ...initialState,
    })),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useSettingsStore = createSelectors(useSettingsStoreBase);
