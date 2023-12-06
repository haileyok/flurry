import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IPerson } from '@src/types/data';
import { Client } from '@src/api/Client';
import { addOrUpdateAccount } from '@src/state/account';
import { IAccount } from '@src/types';

// TODO Rename `personOrUri` to `personOrId`

interface UsePersonQueryOptions {
  client: Client;
  personOrId?: string | IPerson;
  self?: boolean;
  currentAccount?: IAccount;
  enabled?: boolean;
  select?: (data: IPerson) => IPerson;
}

export const usePersonQuery = ({
  client,
  personOrId,
  self = false,
  currentAccount,
  enabled = true,
  select,
}: UsePersonQueryOptions): UseQueryResult<IPerson> =>
  useQuery({
    queryKey: [
      'profile',
      self ? 'self' : (personOrId as IPerson).id ?? personOrId,
    ],
    queryFn: async () => {
      const transformer = client.getTransformer();

      const res = await client.getPerson(
        self ? client.getUserId()! : (personOrId as IPerson).id ?? personOrId,
      );

      const person = transformer.transformPerson(res);

      // Update the account if this is a self query
      if (self && currentAccount != null) {
        addOrUpdateAccount({
          ...currentAccount,
          avatar: person?.avatar,
          displayName: person?.displayName,
        });
      }

      return person;
    },
    placeholderData: () => {
      if (typeof personOrId === 'string') return undefined;

      return personOrId;
    },
    enabled,
    select,
    staleTime: 5 * 60 * 1000,
  });

export const useSelfQuery = (
  client: Client,
  currentAccount?: IAccount,
): UseQueryResult<IPerson> =>
  usePersonQuery({ client, self: true, enabled: false, currentAccount });
