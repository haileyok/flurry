import { useAppStore } from '@src/state/app';

export const setDrawerOpen = (side: 'left' | 'right', open: boolean): void => {
  useAppStore.setState((state) => {
    if (side === 'left') {
      state.leftDrawerOpen = open;
    } else {
      state.rightDrawerOpen = open;
    }
  });
};
