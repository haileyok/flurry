import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { IFeed } from '@src/types/data';
import { filterDuplicatePosts } from '@src/lib/filter/filterDuplicatePosts';
import { Client } from '@src/api/Client';

interface UseFeedQueryOptions {
  client: Client;
  feed?: string;
}

export const useFeedQuery = ({
  client,
  feed,
}: UseFeedQueryOptions): UseInfiniteQueryResult<InfiniteData<IFeed>> =>
  useInfiniteQuery<IFeed>({
    queryKey: ['feed', ...(feed != null ? [feed] : [])],
    queryFn: async ({ pageParam, queryKey }) => {
      return await feedQueryFunction({
        client,
        pageParam,
        queryKey: queryKey as string[],
        feed,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

interface UseFeedQueryFunctionOptions {
  client: Client;
  pageParam?: unknown;
  queryKey: string[];
  feed?: string;
}

export const feedQueryFunction = async ({
  client,
  pageParam,
  queryKey,
  feed,
}: UseFeedQueryFunctionOptions): Promise<IFeed> => {
  const queryClient = client.getQueryClient();
  const transformer = client.getTransformer();

  // If we have a feed, we want to use it
  const res =
    feed == null
      ? await client.getFeed(pageParam as string | undefined)
      : await client.getGeneratorFeed(feed, pageParam as string | undefined);

  // Get all the current posts
  const currentPosts = queryClient.getQueryData<IFeed>(queryKey);

  // Dedupe
  let newPosts = filterDuplicatePosts(
    currentPosts?.posts ?? [],
    res.feed.map((p) => transformer.transformTimelinePost(p)),
  );

  // Remove posts with blocked parents
  // I'm not sure if we need to check if the post itself is blocked, but we will anyway (custom feeds?)
  newPosts = newPosts.filter((p) => !p.isBlocked && !p.parent?.isBlocked);

  // Apply other filters if necessary
  // A query key length of one means we are on the home feed. Other feeds should not be filtered.
  if (queryKey.length === 1) {
    newPosts = transformer.applyFeedFilters(newPosts);
  }

  // Return
  return {
    posts: newPosts,
    cursor: res.cursor,
  };
};
