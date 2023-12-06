import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IPerson } from '@src/types/data';
import { Client } from '@src/api/Client';

interface UseSuggestionsQueryOptions {
  client: Client;
  queryKey: string;
  limit: number;
}

export const useSuggestionsQuery = ({
  client,
  queryKey,
  limit,
}: UseSuggestionsQueryOptions): UseQueryResult<IPerson[]> =>
  useQuery<IPerson[]>({
    queryKey: ['suggestions', queryKey],
    queryFn: async () => {
      const transformer = client.getTransformer();

      const res = await client.getFollowSuggestions(limit);
      return res.actors.map((actor) => transformer.transformPerson(actor));
    },
  });
