import { IPost } from '@src/types/data/IPost';

export interface IFeed {
  posts: IPost[];
  cursor?: string;
}
