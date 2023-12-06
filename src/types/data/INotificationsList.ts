import { INotification } from '@src/types/data/INotification';

export interface INotificationsList {
  notifications: INotification[];
  cursor: string;
}
