import { IPerson, IPersonList } from '@src/types/data';
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { Client } from '@src/api/Client';

interface UsePersonListQueryOptions {
  client: Client;
  type: 'repost' | 'like' | 'following' | 'followers';
  uri: string;
}

export const usePersonListQuery = ({
  client,
  type,
  uri,
}: UsePersonListQueryOptions): UseInfiniteQueryResult<
  InfiniteData<IPersonList>
> =>
  useInfiniteQuery<IPersonList>({
    queryKey: ['personList', type, uri],
    queryFn: async ({ pageParam }) => {
      const transformer = client.getTransformer();

      let persons: IPerson[] = [];
      let cursor: string | undefined;

      switch (type) {
        case 'repost': {
          const res = await client.getRepostedBy(
            uri,
            pageParam as string | undefined,
          );
          persons = res.repostedBy.map((p) => transformer.transformPerson(p));
          cursor = res.cursor;
          break;
        }
        case 'like': {
          const res = await client.getLikedBy(
            uri,
            pageParam as string | undefined,
          );
          persons = res.likes.map((p) => transformer.transformPerson(p.actor));
          cursor = res.cursor;
          break;
        }
        case 'following': {
          const res = await client.getFollowing(
            uri,
            pageParam as string | undefined,
          );
          persons = res.follows.map((p) => transformer.transformPerson(p));
          cursor = res.cursor;
          break;
        }
        case 'followers': {
          const res = await client.getFollowers(
            uri,
            pageParam as string | undefined,
          );

          persons = res.followers.map((p) => transformer.transformPerson(p));
          cursor = res.cursor;
          break;
        }

        default:
          break;
      }

      return {
        persons,
        cursor,
      } as IPersonList;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
