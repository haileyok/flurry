import { IImage } from '@src/types/data/IImage';
import { IExternal } from '@src/types/data/IExternal';
import { IPost } from '@src/types/data/IPost';
import { IGenerator } from '@src/types/data/IGenerator';
import { IList } from '@src/types/data/IList';

export type IEmbedType =
  | 'image'
  | 'external'
  | 'post'
  | 'postWithMedia'
  | 'generator'
  | 'list'
  | 'none';

export interface IEmbed {
  type?: IEmbedType;
  images?: IImage[];
  external?: IExternal;
  post?: Omit<IPost, 'replyRef' | 'shareLink'>;
  generator?: IGenerator;
  list?: IList;
}
