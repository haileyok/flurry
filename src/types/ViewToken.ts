export interface ViewToken<T> {
  item?: T;
  key: string;
  index: number | null;
  isViewable: boolean;
}

export interface IConfigPair<T> {
  viewabilityConfig: object;
  onViewableItemsChanged: ({ viewableItems }: ViewableItemsChanged<T>) => void;
}

export interface ViewableItemsChanged<T> {
  viewableItems?: Array<ViewToken<T>>;
  changed: Array<ViewToken<T>>;
}
