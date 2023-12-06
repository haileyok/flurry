import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { INotificationsList } from '@src/types/data';
import { produce } from 'immer';
import { Client } from '@src/api/Client';

export const useNotificationsQuery = (
  client: Client,
): UseInfiniteQueryResult<InfiniteData<INotificationsList>> =>
  useInfiniteQuery<INotificationsList>({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam }) => {
      return await notificationsQueryFunction({
        client,
        pageParam: pageParam as string | undefined,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    throwOnError: __DEV__,
  });

interface NotificationsQueryFunctionOptions {
  client: Client;
  pageParam?: string | undefined;
}

export const notificationsQueryFunction = async ({
  client,
  pageParam,
}: NotificationsQueryFunctionOptions): Promise<INotificationsList> => {
  const transformer = client.getTransformer();

  const res = await client.getNotifications(pageParam);

  const notifications = await transformer.buildNotificationList(
    client,
    res.notifications,
  );

  return {
    notifications,
    cursor: res.cursor,
  } as INotificationsList;
};

export const refetchNotifications = async (client: Client): Promise<void> => {
  const res = await notificationsQueryFunction({ client });

  // Set the query data
  client
    .getQueryClient()
    .setQueryData<InfiniteData<INotificationsList>>(
      ['notifications'],
      (old) => {
        return produce(old, (draft) => {
          if (draft == null) return;

          draft.pages = [res];
        });
      },
    );
};
