import { ThreadSortType, VisibilityType } from '@src/types/bsky';

export interface IPreferences {
  hideReplies: boolean;
  hideRepliesByUnfollowed: boolean;
  hideRepliesByLikeCount: number | undefined;
  hideReposts: boolean;
  hideQuotePosts: boolean;

  defaultFeed: 'home';

  nsfw: VisibilityType;
  nudity: VisibilityType;
  suggestive: VisibilityType;
  spam: VisibilityType;
  hate: VisibilityType;
  impersonation: VisibilityType;
  gore: VisibilityType;

  adultContent: boolean;

  threadSort: ThreadSortType;
  prioritizeFollowed: boolean;

  savedFeeds: string[];
  pinnedFeeds: string[];
}
