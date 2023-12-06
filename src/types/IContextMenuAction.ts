import { SFSymbol } from 'sf-symbols-typescript';

export interface IContextMenuAction {
  label: string;
  key: string;
  destructive?: boolean;
  onSelect?: () => unknown;
  actions?: IContextMenuAction[];
  iconName?: SFSymbol;
}

export interface IContextMenuActionGroup {
  key: string;
  actions: IContextMenuAction[];
}
