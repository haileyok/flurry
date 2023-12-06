import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage } from 'zustand/esm/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILogMessage } from '@src/types/ILogMessage';

interface LogStore {
  messages: ILogMessage[];
}

export const useLogStore = create(
  persist(
    immer<LogStore>(() => ({
      messages: [],
    })),
    {
      name: 'log',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useLogMessages = (): ILogMessage[] =>
  useLogStore((state) => state.messages);
