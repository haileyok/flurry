import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useClient } from '@root/App';
import { Client } from '@src/api/Client';

const pattern = /inactive|background/;

export const useNotificationsPoll = (client?: Client): void => {
  const hookClient = useClient();

  const appState = useRef(AppState.currentState);

  const refreshInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    refreshInterval.current = setInterval(() => {
      void client?.getUnreadCount?.();
      void hookClient?.getUnreadCount?.();
    }, 30000);

    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (
          pattern.test(appState.current) &&
          nextAppState === 'active' &&
          refreshInterval.current == null
        ) {
          refreshInterval.current = setInterval(() => {
            void client?.getUnreadCount?.();
            void hookClient?.getUnreadCount?.();
          }, 45000);
        } else if (
          appState.current === 'active' &&
          pattern.test(nextAppState)
        ) {
          clearInterval(refreshInterval.current);
          refreshInterval.current = undefined;
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      appStateListener?.remove();
      clearInterval(refreshInterval.current);
      refreshInterval.current = undefined;
    };
  });
};
