import { createContext, useContext } from 'react';
import { IImageViewerContext } from './types';

export const ImageViewerContext = createContext<IImageViewerContext>(
  {} as IImageViewerContext,
);

export const useImageViewer = (): IImageViewerContext =>
  useContext(ImageViewerContext);
