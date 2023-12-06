import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ThreadViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { IThread } from '@src/types/data/IThread';
import { IPost, IThreadPost } from '@src/types/data';
import { Client } from '@src/api/Client';

interface UsePostQueryOptions {
  client: Client;
  postOrUri: string | IPost;
}

export const usePostQuery = ({
  client,
  postOrUri,
}: UsePostQueryOptions): UseQueryResult<IThread> =>
  useQuery<IThread>({
    queryKey: ['post', (postOrUri as IPost).uri ?? postOrUri],
    queryFn: async () => {
      const transformer = client.getTransformer();

      const res = await client.getPost((postOrUri as IPost).uri ?? postOrUri);

      // Transform the data
      const transformed = transformer.transformThreadPost({
        thread: res.thread as ThreadViewPost,
        hasMoreAtDepths: [],
      });

      // Determine the index of the main post
      const mainPostIndex = transformed.parentPosts?.length ?? 0;

      // Flatten the replies
      const flattened = transformer.flattenThread(transformed);

      return {
        mainPostIndex,
        posts: flattened,
      };
    },
    placeholderData: () => {
      if (typeof postOrUri === 'string') return undefined;

      return {
        mainPostIndex: 0,
        posts: [postOrUri as IThreadPost],
      };
    },
  });
