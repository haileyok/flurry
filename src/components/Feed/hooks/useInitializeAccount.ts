import { useEffect, useRef, useState } from 'react';
import { IAccount } from '@src/types';
import { useListsQuery } from '@src/api/queries/bsky/useListsQuery';
import { useFeedsQuery } from '@src/api/queries/bsky/useFeedsQuery';
import { writeLog } from '@src/state/log';
import { useSelfQuery } from '@src/api/queries/bsky/usePersonQuery';
import { usePreferencesQuery } from '@src/api/queries/bsky/usePreferencesQuery';
import { useCurrentAccount } from '@src/state/account';
import { useClient } from '@root/App';

interface UseInitializeAccount {
  isReady: boolean;
}

export const useInitializeAccount = (): UseInitializeAccount => {
  const client = useClient();
  const account = useCurrentAccount();

  const [isReady, setIsReady] = useState(false);

  const { refetch: loadLists } = useListsQuery({ client });
  const { refetch: loadFeeds } = useFeedsQuery({ client });
  const { refetch: loadSelf } = useSelfQuery(client, account);
  const { refetch: loadPreferences } = usePreferencesQuery(client);

  const prevAccount = useRef<IAccount | null>(null);

  useEffect(() => {
    if (
      prevAccount.current != null &&
      account.host === prevAccount.current.host &&
      account.handle === prevAccount.current.handle
    ) {
      return;
    }

    prevAccount.current = account;

    const initialize = async (): Promise<void> => {
      // Reset the client
      client.reset();

      // Initialize the client
      await client.initialize({
        host: account.host,
        handle: account.handle,
        serviceType: account.serviceType,
      });

      // We need to await these
      await Promise.all([loadPreferences(), loadSelf()]);

      // We don't need to await these
      void loadLists();
      void loadFeeds();
      void client.getUnreadCount();

      writeLog('Initialized.');

      setIsReady(true);
    };
    void initialize();
  }, [account, loadFeeds, loadLists, loadPreferences, loadSelf]);

  return {
    isReady,
  };
};
