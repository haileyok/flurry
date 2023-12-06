import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { INotification } from '@src/types';
import {
  PushNotificationTrigger,
  setBadgeCountAsync,
} from 'expo-notifications';
import { NavigationContainerRefWithCurrent } from '@react-navigation/core';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { useClient } from '@root/App';

export const useNotificationListeners = (
  navRef: NavigationContainerRefWithCurrent<MainStackParamList>,
): void => {
  const client = useClient();

  useEffect(() => {
    let isMounted = true;

    const navigate = (notification: INotification): void => {
      // TODO we also need to check that hte appropriate account is signed in
      if (!client.isInitialized()) {
        setTimeout(() => navigate(notification), 1000);
        return;
      }

      void setBadgeCountAsync(0);

      if (notification.type === 'follows') {
        navRef?.navigate('Profile', { personOrUri: notification.creator });
      } else {
        navRef?.navigate('Post', { uri: notification.uri });
      }
    };

    // If a notification is received while the app is in the foreground, we
    // don't want to play a sound. Just show the notification.
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    void Notifications.getLastNotificationResponseAsync().then((res) => {
      if (!isMounted || res?.notification == null) return;

      void navigate(
        (res.notification.request.trigger as PushNotificationTrigger)
          .payload as unknown as INotification,
      );
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (res) => {
        void navigate(
          (res.notification.request.trigger as PushNotificationTrigger)
            .payload as unknown as INotification,
        );
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [client, navRef]);
};
