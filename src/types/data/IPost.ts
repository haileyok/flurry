import { IPerson } from '@src/types/data/IPerson';
import { IEmbed } from '@src/types/data/IEmbed';
import { ILabels } from '@src/types/data/ILabels';
import { ReplyRef } from '@atproto/api/src/client/types/app/bsky/feed/post';
import { Facet } from '@atproto/api';
import { ThreadViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs';

export interface IPost {
  type: 'timeline' | 'thread' | 'generic';

  isNotFound: boolean;
  isBlocked: boolean;

  uri: string;
  cid: string;
  creator?: IPerson;

  body?: string;
  facets?: Facet[];

  embed?: IEmbed;

  labels?: ILabels;

  isRepost: boolean;
  repostedBy?: IPerson;

  hasRoot: boolean;
  root?: IPost;

  likes: number;
  like?: string;
  reposts: number;
  repost?: string;

  replies: number;

  hasParent: boolean;
  parent?: IPost;

  createdAt?: string;

  replyRef: ReplyRef;

  shareLink: string;
}

export interface IThreadPost extends IPost {
  hasParent: boolean;
  parentPosts: IThreadPost[] | undefined;

  hasReply: boolean;
  replyPosts?: IThreadPost[];

  depth: number;
  hasMoreAtDepths: number[];
}

export interface TransformThreadPostOptions {
  thread: ThreadViewPost;
  depth?: number;
  hasParent?: boolean;
  hasReply?: boolean;
  hasMoreAtDepths: number[];
}
