import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View as RNView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Image, ImageLoadEventData } from 'expo-image';
import { IDimensions, IViewerImageProps } from './types';
import { useImageViewer } from './ImageViewerContext';
import { getDimensions } from '@src/lib/imageViewer/util';
import {
  setImageDimensions,
  useSavedDimensions,
} from '@src/state/images/imageStore';

const AnimatedImage = Animated.createAnimatedComponent(Image);

function ViewerImageInner({
  style,
  images,
  imageIndex,
  blurRadius = 0,
  contentFit = 'contain',
  heightModifier = 0.5,
  widthModifier = 1,
  defaultDimensions,
}: IViewerImageProps): React.JSX.Element {
  // Get the image viewer context
  const imageViewer = useImageViewer();
  const savedDimensions = useSavedDimensions(images[imageIndex].thumb);

  // Some images do not have a width or height supplied, so we need to store them after the image has loaded for:
  // 1. viewer
  // 2. flashlist
  // We *could* update the actual post in the query client, but then we'd need to make sure we are checking in a few
  // different places for the image dimensions. Instead, we'll store the data in a zustand store and just use it
  // as necessary from there.

  const onLoad = useCallback(
    (e: ImageLoadEventData) => {
      const image = images.find((i) => i.thumb === e.source.url);

      // If we don't have an image, then we don't need to do anything (just for TS)
      if (image == null) return;
      // If we already have the dimensions from the API or if we have them saved, then we don't want to store them and cause a rerender.
      // We *do* want to store them even if we are using default dimensions, since we need them for the animation when opening the image viewer
      if (image.height !== 0 || savedDimensions != null) return;

      setImageDimensions(e.source.url, {
        height: e.source.height,
        width: e.source.width,
      });
    },
    [images],
  );

  // Calculate our dimensions
  const dimensions: IDimensions = useMemo(() => {
    // If we have supplied dimensions, use those
    if (defaultDimensions != null) return defaultDimensions;

    // Determine which dimensions to use.
    // 1. If we have them from the API, use those
    // 2. If we don't, then try to use the saved dimensions
    // 3. If we don't, then just use 100x100. This should update as soon as the image loads to use the save dimensions
    const dimensionsToUse =
      images[imageIndex].height !== 0
        ? images[imageIndex]
        : savedDimensions ?? { height: 100, width: 100 };

    return getDimensions(dimensionsToUse, heightModifier, widthModifier);
  }, [images, imageIndex, defaultDimensions, savedDimensions]);

  const ref = useRef<RNView>(null);

  // Create a shared value for the opacity of the image
  const opacity = useSharedValue(1);

  // set up the image viewer when the image is pressed then display it
  const onImagePress = useCallback(() => {
    imageViewer.dispatch({
      type: 'setState',
      // @ts-expect-error TODO Fix
      payload: {
        params: {
          images,
          imageIndex,
        },
        visible: true,
        viewerRef: ref,
        viewerOpacity: opacity,
      },
    });
  }, [images, imageIndex]);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPress={onImagePress}
      style={[styles.image, styles.container]}
      ref={ref}
    >
      <AnimatedImage
        source={images[imageIndex].thumb}
        style={[styles.image, style, dimensions, imageStyle]}
        recyclingKey={images[imageIndex].thumb}
        blurRadius={blurRadius}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        onLoad={onLoad}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityIndicator: {
    position: 'absolute',
  },

  image: {
    borderRadius: 10,
  },
});

export const ViewerImage = React.memo(ViewerImageInner);
