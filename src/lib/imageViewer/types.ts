import React from 'react';
import { StyleProp, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { ImageContentFit } from 'expo-image';
import { IImage } from '@src/types/data';

export interface IDimensions {
  width: number;
  height: number;
}

export interface IImageViewerParams {
  images: IImage[];
  imageIndex: number;
}

export interface IImageViewerState {
  params: IImageViewerParams;
  visible: boolean;
  viewerRef: React.RefObject<View> | null;
  viewerOpacity?: SharedValue<number>;
}

interface IAction {
  type: string;
  payload: boolean | number;
}

export interface IImageViewerContext {
  state: IImageViewerState;
  dispatch: React.Dispatch<IAction>;
}

export interface IViewerImageProps {
  // Either a string or an array of strings of sources
  images: IImage[];
  imageIndex: number;
  // An optional blur radius to apply to the image (the blur radius will not be shown in the image viewer)
  blurRadius?: number;
  // An optional content fit to apply to the image
  contentFit?: ImageContentFit;
  // Height modifier
  heightModifier?: number;
  // Width modifier: number;
  widthModifier?: number;
  // Default dimensions to use instead of calculated dimensions
  defaultDimensions?: IDimensions;
  // Default styles to apply
  style?: StyleProp<any>;
}
