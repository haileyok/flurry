import { useAppStore } from '@src/state/app';

export const setUnreadCount = (count: number): void => {
  useAppStore.setState((state) => {
    state.unreadCount = count;
  });
};
