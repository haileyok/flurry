import { IPerson } from '@src/types/data/IPerson';
import { IPost } from '@src/types/data/IPost';

export type NotificationType =
  | 'like'
  | 'repost'
  | 'follow'
  | 'mention'
  | 'reply'
  | 'quote';

export interface INotification {
  creators: IPerson[];
  type: NotificationType;
  isRead: boolean;
  record?: IPost;
  subject?: string;
  uri: string;
  cid: string;
  createdAt: string;
}
