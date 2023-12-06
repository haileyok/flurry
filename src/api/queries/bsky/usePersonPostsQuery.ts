import { IFeed } from '@src/types/data';
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { PersonPostsFilterType } from '@src/types/bsky/PersonPostsFilterType';
import { Client } from '@src/api/Client';

interface UsePersonPostsQueryOptions {
  client: Client;
  uri: string;
  type: PersonPostsFilterType;
}

export const usePersonPostsQuery = ({
  client,
  uri,
  type,
}: UsePersonPostsQueryOptions): UseInfiniteQueryResult<InfiniteData<IFeed>> =>
  useInfiniteQuery<IFeed>({
    queryKey: ['feed', uri, type],
    queryFn: async ({ pageParam }) => {
      return await personPostsQueryFunction({
        client,
        uri,
        type,
        pageParam: pageParam as string | undefined,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

interface PersonPostsQueryFunctionOptions {
  client: Client;
  uri: string;
  type: PersonPostsFilterType;
  pageParam?: string | undefined;
}

export const personPostsQueryFunction = async ({
  client,
  uri,
  type,
  pageParam,
}: PersonPostsQueryFunctionOptions): Promise<IFeed> => {
  const transformer = client.getTransformer();

  if (type === 'likes') {
    const res = await client.getPersonLikes(uri, pageParam);

    return {
      posts: res.feed.map((p) => transformer.transformTimelinePost(p)),
      cursor: res.cursor,
    };
  } else {
    const res = await client.getPersonPosts(uri, type, pageParam);

    return {
      posts: res.feed.map((p) => transformer.transformTimelinePost(p)),
      cursor: res.cursor,
    };
  }
};
