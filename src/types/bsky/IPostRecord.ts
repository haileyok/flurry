import { ReplyRef } from '@atproto/api/src/client/types/app/bsky/feed/post';
import { Image } from '@atproto/api/src/client/types/app/bsky/embed/images';
import * as AppBskyActorDefs from '@atproto/api/src/client/types/app/bsky/actor/defs';
import * as ComAtprotoLabelDefs from '@atproto/api/src/client/types/com/atproto/label/defs';
import { Facet } from '@atproto/api';

export enum PostRecordType {
  Text = 'app.bsky.post.record.text',
}

export interface IBskyEmbedRecord {
  $type: string;
  uri: string;
  cid: string;
  author: AppBskyActorDefs.ProfileView;
  value: IBskyPostRecord;
  labels?: ComAtprotoLabelDefs.Label[];
  embeds?: IBskyEmbed[];
  indexedAt: string;
  notFound?: boolean;
  [k: string]: unknown;
}

export interface IBskyImage extends Image {
  thumb: string;
  fullsize: string;
}

export interface IBskyEmbed {
  $type: string;
  images?: IBskyImage[];
  external?: IBskyExternal;
  // eslint-disable-next-line
  record?: IBskyEmbedRecord | { record: IBskyEmbedRecord, };
  media?: IBskyEmbed;
}

export interface IBskyExternal {
  uri: string;
  title?: string;
  description?: string;
  thumb?: string;
}

export interface IBskyPostRecord {
  $type: PostRecordType;
  text?: string;
  langs: string[];
  reply: ReplyRef;
  createdAt: string;
  embed: IBskyEmbed;
  facets: Facet[];
}
