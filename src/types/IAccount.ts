import { IServiceType } from '@src/api/types';

export interface IAccount {
  serviceType: IServiceType;
  host: string;
  handle: string;
  displayName?: string;
  avatar?: string;
}
