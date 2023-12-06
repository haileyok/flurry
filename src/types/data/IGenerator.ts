import { IPerson } from '@src/types/data/IPerson';
import { Facet } from '@atproto/api';

export interface IGenerator {
  uri: string;
  cid: string;
  creator: IPerson;
  name: string;
  description?: string;
  facets?: Facet[];
  avatar?: string;
  likes: number;
  like?: string;
  pinned: boolean;
  saved: boolean;
}
