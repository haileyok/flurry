import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface Dimensions {
  width: number;
  height: number;
}

interface ImageStore {
  images: Map<string, Dimensions>;
}

export const useImageStore = create(
  immer<ImageStore>(() => ({
    images: new Map<string, Dimensions>(),
  })),
);

export const useSavedDimensions = (uri: string): Dimensions | undefined =>
  useImageStore((state) => state.images.get(uri));

export const setImageDimensions = (
  uri: string,
  dimensions: Dimensions,
): void => {
  useImageStore.setState((state) => {
    state.images.set(uri, dimensions);
  });
};
