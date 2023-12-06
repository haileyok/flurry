import {
  InfiniteData,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query';
import { produce } from 'immer';
import { ICommonResponse } from '@src/types/bsky';
import { IFeed, IPost } from '@src/types/data';
import { IThread } from '@src/types/data/IThread';
import { Client } from '@src/api/Client';

export interface LikeVariables {
  type: 'like' | 'repost';
  like?: string;
  repost?: string;
  uri: string;
  cid: string;
}

/**
 * Here we want to update all the caches if a like is changed. We will optimistically change both the like status and
 * the number of likes then if we liked the post, we will set the like URI after we get a response.
 *
 * Eventually we might try to refactor this, it seems a bit ugly. But considering this (should) be the only two places
 * we have to update (feed cache and post cache) it isn't too big of a deal for now. Immer makes this look
 */
export const useLikeRepostMutation = (
  client: Client,
): UseMutationResult<ICommonResponse, Error, LikeVariables> =>
  useMutation<ICommonResponse, Error, LikeVariables>({
    mutationFn: async (variables) => {
      if (variables[variables.type] == null) {
        if (variables.type === 'repost') {
          return await client.repost(variables.uri, variables.cid);
        } else {
          return await client.likePost(variables.uri, variables.cid);
        }
      } else {
        if (variables.type === 'repost') {
          await client.deleteRepost(variables.like!);
        } else {
          await client.unlikePost(variables.like!);
        }
      }
    },
    onMutate: async (variables) => {
      const queryClient = client.getQueryClient();

      const type = variables.type;
      const plural: 'likes' | 'reposts' = `${variables.type}s`;

      // Update the feed cache
      queryClient.setQueriesData<InfiniteData<IFeed>>(
        { queryKey: ['feed'], exact: false },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            for (const page of draft.pages) {
              for (const post of page.posts) {
                const parent = post?.parent;

                if (post.cid === variables.cid) {
                  if (post.like == null) {
                    post[type] = 'pending...';
                    post[plural]++;
                  } else {
                    post[type] = undefined;
                    post[plural] -= 1;
                  }
                } else if (parent?.cid === variables.cid) {
                  if (parent.like == null) {
                    parent[type] = 'pending...';
                    parent[plural]++;
                  } else {
                    parent[type] = undefined;
                    parent[plural] -= 1;
                  }
                }
              }
            }
          });
        },
      );

      // Update the post caches
      queryClient.setQueriesData<IThread>(
        {
          queryKey: ['post'],
          exact: false,
        },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            const post = draft.posts.find(
              (p) => p.cid === variables.cid,
            ) as IPost;

            if (post?.cid === variables.cid) {
              if (post.like == null) {
                post[type] = 'pending...';
                post[plural]++;
              } else {
                post[type] = undefined;
                post[plural]--;
              }
            }
          });
        },
      );
    },
    onSuccess: (data, variables) => {
      const queryClient = client.getQueryClient();

      const type = variables.type;

      // Update the feed cache
      queryClient.setQueriesData<InfiniteData<IFeed>>(
        { queryKey: ['feed'], exact: false },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            for (const page of draft.pages) {
              for (const post of page.posts) {
                const parent = post?.parent;

                if (post.cid === variables.cid && post.like === 'pending...') {
                  post[type] = data!.uri;
                } else if (
                  parent?.cid === variables.cid &&
                  parent[type] === 'pending...'
                ) {
                  parent[type] = data!.uri;
                }
              }
            }
          });
        },
      );

      queryClient.setQueriesData<IThread>(
        {
          queryKey: ['post'],
          exact: false,
        },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            const post = draft.posts.find((p) => p.cid === variables.cid);

            if (post?.cid === variables.cid && post.like === 'pending...') {
              post[type] = data!.uri;
            }
          });
        },
      );
    },
  });
