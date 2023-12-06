import * as fs from 'expo-file-system'; // TODO Remove expo file system
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseImageCacheInfo {
  cacheSize: string;
  clearImageCache: () => Promise<void>;
}

export const useImageCacheInfo = (): UseImageCacheInfo => {
  const [cacheSize, setCacheSize] = useState<string>('0.00 GB');

  const getCacheSize = async (): Promise<void> => {
    const cacheInfo = await fs.getInfoAsync(
      fs.cacheDirectory + '/com.hackemist.SDImageCache',
    );

    // @ts-expect-error This exists
    const size = cacheInfo?.size ?? 0;

    setCacheSize(
      Number(size / Math.pow(1024, 3))
        .toPrecision(2)
        .toString() + ' GB',
    );
  };

  useEffect(() => {
    void getCacheSize();
  }, []);

  const clearImageCache = async (): Promise<void> => {
    await Image.clearDiskCache();
    Alert.alert('Cache Cleared', 'The image cache has been cleared.');
    void getCacheSize();
  };

  return {
    cacheSize,
    clearImageCache,
  };
};
