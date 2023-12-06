import { IServiceType } from '@src/api/types/common/IServiceType';

export interface IInitOptions {
  serviceType: IServiceType;
  host: string;
  handle: string;
}
