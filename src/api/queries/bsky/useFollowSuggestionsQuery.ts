import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IPerson } from '@src/types/data';
import { Client } from '@src/api/Client';

interface UseFollowSuggestionsQueryOptions {
  client: Client;
  queryKey: string;
  limit?: number;
}

export const useFollowSuggestionsQuery = ({
  client,
  queryKey,
  limit = 10,
}: UseFollowSuggestionsQueryOptions): UseQueryResult<IPerson[]> =>
  useQuery({
    queryKey: ['suggestions', queryKey],
    queryFn: async () => {
      const transformer = client.getTransformer();

      const res = await client.getFollowSuggestions(limit);

      return res.actors.map((p) => transformer.transformPerson(p));
    },
  });
