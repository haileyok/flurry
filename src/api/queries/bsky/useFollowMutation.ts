import {
  InfiniteData,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query';
import { ICommonResponse } from '@src/types/bsky';
import { produce } from 'immer';
import { IPerson, IPersonList } from '@src/types/data';
import { Client } from '@src/api/Client';

export interface FollowVariables {
  id: string;
  followUri: string | undefined;
}

export const useFollowMutation = (
  client: Client,
): UseMutationResult<ICommonResponse, Error, FollowVariables> =>
  useMutation<ICommonResponse, Error, FollowVariables>({
    mutationFn: async (variables) => {
      if (variables.followUri == null) {
        return await client.followPerson(variables.id);
      } else {
        await client.unfollowPerson(variables.followUri);
      }
    },
    onMutate: async (variables) => {
      const queryClient = client.getQueryClient();

      queryClient.setQueriesData<InfiniteData<IPersonList>>(
        { queryKey: ['personList'] },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            for (const page of draft.pages) {
              const person = page.persons.find((p) => p.id === variables.id);

              if (person == null) continue;

              if (person.isFollowing) {
                person.followingUri = undefined;
                person.isFollowing = false;
              } else {
                person.followingUri = 'pending...';
                person.isFollowing = true;
              }
            }
          });
        },
      );

      queryClient.setQueriesData<IPerson>(
        { queryKey: ['profile', variables.id], exact: true },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            if (draft.isFollowing) {
              draft.followingUri = undefined;
              draft.isFollowing = false;
            } else {
              draft.followingUri = 'pending...';
              draft.isFollowing = true;
            }
          });
        },
      );

      queryClient.setQueriesData<IPerson[]>(
        { queryKey: ['suggestions'], exact: false },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            const person = draft.find((p) => p.id === variables.id);

            if (person == null) return;

            if (person.isFollowing) {
              person.followingUri = undefined;
              person.isFollowing = false;
            } else {
              person.followingUri = 'pending...';
              person.isFollowing = true;
            }
          });
        },
      );
    },
    onSuccess: async (data, variables) => {
      const queryClient = client.getQueryClient();

      queryClient.setQueriesData<InfiniteData<IPersonList>>(
        { queryKey: ['personList'] },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            for (const page of draft.pages) {
              const person = page.persons.find((p) => p.id === variables.id);

              if (person == null) continue;

              if (person.followingUri === 'pending...') {
                person.followingUri = data!.uri;
              }
            }
          });
        },
      );

      queryClient.setQueriesData<IPerson>(
        { queryKey: ['profile', variables.id], exact: true },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            if (draft.followingUri === 'pending...') {
              draft.followingUri = data!.uri;
            }
          });
        },
      );

      queryClient.setQueriesData<IPerson[]>(
        { queryKey: ['suggestions'], exact: false },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            const person = draft.find((p) => p.id === variables.id);

            if (person == null) return;

            if (person.followingUri === 'pending...') {
              person.followingUri = data!.uri;
            }
          });
        },
      );
    },
    onError: async (error, variables) => {
      const queryClient = client.getQueryClient();

      queryClient.setQueriesData<InfiniteData<IPersonList>>(
        { queryKey: ['personList'] },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            for (const page of draft.pages) {
              const person = page.persons.find((p) => p.id === variables.id);

              if (person == null) continue;

              if (person.isFollowing) {
                person.followingUri = undefined;
                person.isFollowing = false;
              } else {
                person.followingUri = variables.followUri;
                person.isFollowing = false;
              }
            }
          });
        },
      );

      queryClient.setQueriesData<IPerson>(
        { queryKey: ['profile', variables.id], exact: true },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            if (draft.isFollowing) {
              draft.followingUri = undefined;
              draft.isFollowing = false;
            } else {
              draft.followingUri = variables.followUri;
              draft.isFollowing = false;
            }
          });
        },
      );

      queryClient.setQueriesData<IPerson[]>(
        { queryKey: ['suggestions'], exact: false },
        (prev) => {
          return produce(prev, (draft) => {
            if (draft == null) return;

            const person = draft.find((p) => p.id === variables.id);

            if (person == null) return;

            if (person.isFollowing) {
              person.followingUri = undefined;
              person.isFollowing = false;
            } else {
              person.followingUri = variables.followUri;
              person.isFollowing = false;
            }
          });
        },
      );
    },
  });
