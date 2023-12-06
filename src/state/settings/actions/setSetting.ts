import {
  SettingsStore,
  useSettingsStore,
} from '@src/state/settings/settingsStore';

export const setSetting = (setting: keyof SettingsStore, value: any): void => {
  useSettingsStore.setState((state) => {
    // @ts-expect-error - whatever for now
    state[setting] = value;
  });
};
