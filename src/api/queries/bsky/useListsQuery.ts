import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IList } from '@src/types/data';
import { Client } from '@src/api/Client';

interface UseListsQueryOptions {
  client: Client;
  actor?: string;
}

export const useListsQuery = ({
  client,
  actor,
}: UseListsQueryOptions): UseQueryResult<IList[]> =>
  useQuery<IList[]>({
    queryKey: ['lists', actor ?? 'self'],
    queryFn: async () => {
      const transformer = client.getTransformer();

      const res = await client.getLists({
        actor,
      });

      return res.lists.map((l) => transformer.transformListView(l)) as IList[];
    },
    staleTime: Infinity,
    enabled: false,
  });
