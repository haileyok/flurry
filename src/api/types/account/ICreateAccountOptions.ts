import { IServiceType } from '@src/api/types/common/IServiceType';

export interface ICreateAccountOptions {
  serviceType: IServiceType;
  email?: string;
  password?: string;
  handle?: string;
  inviteCode?: string;
}
