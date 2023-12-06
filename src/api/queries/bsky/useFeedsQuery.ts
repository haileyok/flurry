import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IGenerator } from '@src/types/data';
import { AppBskyFeedGetFeedGenerators } from '@atproto/api';
import { getPreferences } from '@src/api/queries/bsky/usePreferencesQuery';
import { Client } from '@src/api/Client';

interface UseFeedsQueryOptions {
  client: Client;
  actor?: string;
  popular?: boolean;
}

// TODO Right now this requires a query invalidation. We should not require this.

export const useFeedsQuery = ({
  client,
  actor,
  popular = false,
}: UseFeedsQueryOptions): UseQueryResult<IGenerator[]> =>
  useQuery<IGenerator[]>({
    queryKey: [
      'feeds',
      ...(actor != null ? [actor] : []),
      ...(popular ? ['popular'] : []),
      ...(actor == null && !popular ? ['self'] : []),
    ],
    queryFn: async () => {
      const transformer = client.getTransformer();

      // If we don't pass in any feeds, we will use the user's feeds
      const { savedFeeds, pinnedFeeds } = getPreferences(
        client.getQueryClient(),
      );

      let res: AppBskyFeedGetFeedGenerators.OutputSchema;

      if (actor != null) {
        res = await client.getActorFeeds(actor);
      } else if (popular) {
        res = await client.searchFeeds();
      } else {
        res = await client.getFeeds(savedFeeds);

        return res.feeds.map((f) =>
          transformer.transformGeneratorView(f, savedFeeds, pinnedFeeds),
        ) as IGenerator[];
      }

      return res.feeds.map((f) =>
        transformer.transformGeneratorView(f),
      ) as IGenerator[];
    },
    staleTime: Infinity,
    enabled: true,
  });
