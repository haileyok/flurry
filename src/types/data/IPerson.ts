import { Facet } from '@atproto/api';
import { IList } from '@src/types/data/IList';

export interface IPerson {
  id: string;

  displayName?: string;
  handle: string;

  followedBy: boolean;
  isFollowing: boolean;
  followingUri?: string;

  isBlocked: boolean;
  blockingUri?: string;
  blockingList?: IList;

  blockedBy: boolean;

  isMuted: boolean;
  mutedUri?: string;
  mutedList?: IList;

  avatar?: string;
  banner?: string;

  followers?: number;
  following?: number;
  posts?: number;

  description?: string;
  facets?: Facet[];
}
