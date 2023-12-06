import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { IPreferences } from '@src/types/data';
import { Client } from '@src/api/Client';

export const usePreferencesQuery = (
  client: Client,
): UseQueryResult<IPreferences> =>
  useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const res = await client.getPreferences();

      return {
        savedFeeds: res.feeds.saved ?? [],
        pinnedFeeds: res.feeds.pinned ?? [],

        hideReplies: res.feedViewPrefs.home.hideReplies,
        hideRepliesByUnfollowed: res.feedViewPrefs.home.hideRepliesByUnfollowed,
        hideRepliesByLikeCount: res.feedViewPrefs.home.hideRepliesByLikeCount,
        hideReposts: res.feedViewPrefs.home.hideReposts,
        hideQuotePosts: res.feedViewPrefs.home.hideQuotePosts,

        threadSort: res.threadViewPrefs.sort,
        prioritizeFollowed: res.threadViewPrefs.prioritizeFollowedUsers,

        adultContent: res.adultContentEnabled,

        nsfw: res.contentLabels.nsfw,
        nudity: res.contentLabels.nudity,
        suggestive: res.contentLabels.suggestive,
        spam: res.contentLabels.spam,
        hate: res.contentLabels.hate,
        gore: res.contentLabels.gore ?? 'hide',
        impersonation: res.contentLabels.impersonation ?? 'hide',
      } as IPreferences;
    },
    enabled: false,
  });

// A little helper to get the preferences without a hook
export const getPreferences = (queryClient: QueryClient): IPreferences =>
  queryClient.getQueryData(['preferences'])!;
