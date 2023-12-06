import { IPerson } from '@src/types/data/IPerson';
import { Label } from '@atproto/api';
import { ListViewerState } from '@atproto/api/src/client/types/app/bsky/graph/defs';

export interface IList {
  type: 'basic' | 'full';
  uri: string;
  cid: string;
  creator?: IPerson;
  name: string;
  description?: string;
  avatar?: string;
  labels: Label[];
  viewer?: ListViewerState;
}
