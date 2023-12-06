import { useCallback, useState } from 'react';

interface UseUserRefresh {
  isRefreshing: boolean;
  onUserRefresh: () => Promise<void>;
}

export const useUserRefresh = (refetch: () => unknown): UseUserRefresh => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onUserRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  return {
    isRefreshing,
    onUserRefresh,
  };
};
