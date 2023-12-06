import { IThreadPost } from '@src/types/data/IPost';

export interface IThread {
  mainPostIndex: number;
  posts: IThreadPost[];
}
