import { useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import axios from 'axios';
import { useClient } from '@root/App';

const API_URL = process.env.EXPO_PUBLIC_FLURRY_API_URL;

interface UseNotifications {
  isLoading: boolean;
  enable: () => Promise<boolean>;
  disable: () => Promise<boolean>;
}

export const useNotifications = (): UseNotifications => {
  const client = useClient();

  const [isLoading, setIsLoading] = useState(false);

  const register = async (): Promise<string | null> => {
    // Try to get permission
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Error',
        'Please grant Flurry permission to send notifications.',
      );
      return null;
    }

    return (await Notifications.getDevicePushTokenAsync()).data;
  };

  const enable = async (): Promise<boolean> => {
    const token = await register();

    if (token == null) return false;

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/push/register`, {
        token,
        did: client.getUserId(),
        platform: Platform.OS,
      });

      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      Alert.alert(
        'Error',
        'An error occurred while registering for push notifications.',
      );
      return false;
    }
  };

  const disable = async (): Promise<boolean> => {
    const token = await register();

    if (token == null) return false;

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/push/unregister`, {
        token,
        did: client.getUserId(),
        platform: Platform.OS,
      });

      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      Alert.alert(
        'Error',
        'An error occurred while registering for push notifications.',
      );
      return false;
    }
  };

  return {
    isLoading,
    enable,
    disable,
  };
};
