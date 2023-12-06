import { IPerson } from '@src/types/data/IPerson';

export interface IPersonList {
  persons: IPerson[];
  cursor: string;
}
