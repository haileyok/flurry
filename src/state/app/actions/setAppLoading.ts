import { useAppStore } from '@src/state/app/appStore';

export const setAppLoading = (isLoading: boolean): void => {
  useAppStore.setState((state) => {
    state.isLoading = isLoading;
  });
};
