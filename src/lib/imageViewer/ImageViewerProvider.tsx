import React, { useEffect, useReducer } from 'react';
import { IImageViewerState } from './types';
import { Modal, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import ImageViewer from './ImageViewer';
import { ImageViewerContext } from './ImageViewerContext';

interface IAction {
  type: string;
  payload: Partial<IImageViewerState> | boolean | number;
}

const reducer = (
  state: IImageViewerState,
  action: IAction,
): IImageViewerState => {
  switch (action.type) {
    case 'setState':
      return {
        ...state,
        ...(action.payload as IImageViewerState),
      };
    case 'setVisible':
      return {
        ...state,
        visible: action.payload as boolean,
      };
    case 'setIndex':
      return {
        ...state,
        params: {
          ...state.params,
          imageIndex: action.payload as number,
        },
      };
    default:
      return state;
  }
};

interface IProps {
  children: React.ReactNode;
}

export function ImageViewerProvider({ children }: IProps): React.JSX.Element {
  // @ts-expect-error TODO Fix
  const [viewerProps, dispatch] = useReducer(reducer, {
    params: {
      source: null,
      title: null,
      index: 0,
    },
    visible: false,
    viewerRef: null,
    viewerOpacity: null,
  });

  // Whenever the sources change, we want to preload if necessary. We are not going to preload if the source is only
  // one image.
  useEffect(() => {
    // Do nothing if the source is null or is only a single source. The image should already be preloaded
    if (
      viewerProps.params.source == null ||
      typeof viewerProps.params.source === 'string' ||
      viewerProps.params.source.length === 1
    ) {
      return;
    }

    // Prefetch the images in the source list
    void Image.prefetch(viewerProps.params.source);
  }, [viewerProps.params.source]);

  return (
    <ImageViewerContext.Provider
      value={{
        state: viewerProps,
        dispatch,
      }}
    >
      {/* We need to set a zIndex of -1 here otherwise we run into issues on Android */}
      <View style={styles.container}>
        <Modal
          visible={viewerProps.visible}
          transparent
          statusBarTranslucent
          hardwareAccelerated
        >
          <ImageViewer />
        </Modal>
      </View>
      {children}
    </ImageViewerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: -1,
  },
});
