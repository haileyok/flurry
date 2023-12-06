import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AppStore {
  isLoading: boolean;
  replyUri: string | null;
  leftDrawerOpen: boolean;
  rightDrawerOpen: boolean;

  unreadCount: number;
}

const initialState: AppStore = {
  isLoading: false,
  replyUri: null,
  leftDrawerOpen: false,
  rightDrawerOpen: false,

  unreadCount: 0,
};

export const useAppStore = create(
  immer<AppStore>(() => ({
    ...initialState,
  })),
);

export const useAppLoading = (): boolean =>
  useAppStore((state) => state.isLoading);

export const useReplyUri = (): string | null =>
  useAppStore((state) => state.replyUri);

export const useLeftDrawerOpen = (): boolean =>
  useAppStore((state) => state.leftDrawerOpen);

export const useRightDrawerOpen = (): boolean =>
  useAppStore((state) => state.rightDrawerOpen);

export const useUnreadCount = (): number =>
  useAppStore((state) => state.unreadCount);
