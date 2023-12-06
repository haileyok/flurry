import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { useImageViewer } from './ImageViewerContext';
import {
  Gesture,
  GestureDetector,
  gestureHandlerRootHOC,
  GestureStateChangeEvent,
  GestureType,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { getDimensions, runImpact } from './util';
import { ImageViewerFooter } from '@src/lib/imageViewer/ImageViewerFooter';
import { ImageViewerHeader } from '@src/lib/imageViewer/ImageViewerHeader';
import { useSavedDimensions } from '@src/state/images/imageStore';

interface ViewMeasurement {
  x: number;
  y: number;
  width: number;
  height: number;
  px: number;
  py: number;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const PLATFORM = Platform.OS;

function ImageViewer(): React.JSX.Element {
  const { state, dispatch } = useImageViewer();
  const currentImage = useMemo(
    () => state.params.images[state.params.imageIndex],
    [state.params.images, state.params.imageIndex],
  );
  const savedDimensions = useSavedDimensions(currentImage.thumb);

  const dimensions = useMemo(() => {
    const dimensionsToUse =
      currentImage.height !== 0
        ? currentImage
        : savedDimensions ?? { height: 100, width: 100 };

    return getDimensions(
      {
        height: dimensionsToUse.height,
        width: dimensionsToUse.width,
      },
      0.9,
      1,
    );
  }, [currentImage]);

  const { height: fullHeight, width: fullWidth } = dimensions;

  // Whether to display header and footer
  const [accessoriesVisible, setAccessoriesVisible] = useState(true);

  // region shared values
  const backgroundColor = useSharedValue('rgba(0, 0, 0, 0)');

  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const scale = useSharedValue(1);
  const lastScale = useSharedValue(1);

  const accessoryOpacity = useSharedValue(0);

  const origin = useSharedValue<ViewMeasurement>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    px: 0,
    py: 0,
  });

  // endregion

  const centerX = (SCREEN_WIDTH - fullWidth) / 2;
  const centerY = (SCREEN_HEIGHT - fullHeight) / 2;

  // region open and close
  /**
   * Whenever we open the viewer:
   * 1. Measure the original image position
   * 2. Move the image to that position
   * 3. Animate the background color (opacity)
   * 4. Move the image to the center of the screen
   * 5. Resize the image up to the screen size
   */
  useEffect(() => {
    'worklet';
    const delay = PLATFORM === 'ios' ? 32 : 64;

    // If we are closing, do nothing
    if (!state.visible) return;

    // Measure the original position of the image
    state.viewerRef?.current?.measure((x, y, w, h, px, py) => {
      // Store the position for later when we close the viewer
      origin.value = {
        x,
        y,
        width: w,
        height: h,
        px,
        py,
      };

      // Set the initial position
      positionX.value = px;
      positionY.value = py;

      // Set the initial dimensions
      height.value = h;
      width.value = w;

      // Hide the original image
      setTimeout(() => {
        state.viewerOpacity!.value = 0;
      }, delay);

      // Set the new position with timing
      centerImage();

      // Set the new dimensions with timing
      height.value = withTiming(fullHeight, { duration: 300 });
      width.value = withTiming(fullWidth, { duration: 300 });

      // Fade in the background
      backgroundColor.value = withTiming('rgba(0, 0, 0, 1)', { duration: 300 });

      // Show the accessories. This needs to be animated (as opposed to using a setState) because we want to run
      // all the animations on the UI thread
      accessoryOpacity.value = withTiming(1, { duration: 300 });
    });
  }, [state.visible]);

  /**
   * Closes the viewer
   */
  const closeViewer = useCallback(() => {
    // Hide the accessories
    accessoryOpacity.value = withTiming(0, { duration: 300 });
    // Fade out the background;
    backgroundColor.value = withTiming('rgba(0, 0, 0, 0)', { duration: 300 });

    // Move the image back to its original position
    positionX.value = withTiming(origin.value.px, { duration: 300 });
    positionY.value = withTiming(origin.value.py, { duration: 300 });

    // Resize the image back to its original size
    height.value = withTiming(origin.value.height, { duration: 300 });
    width.value = withTiming(origin.value.width, { duration: 300 });

    // Set the image's opacity back to one about two frames before the modal disappears
    setTimeout(() => {
      state.viewerOpacity!.value = 1;
    }, 278);

    // Hide the viewer once the animations are finished
    setTimeout(() => {
      dispatch({
        type: 'setVisible',
        payload: false,
      });
    }, 300);
  }, []);

  // endregion

  /**
   * Just moves the image to the center of the screen
   */
  const centerImage = (): void => {
    'worklet';

    positionX.value = withTiming(centerX, { duration: 300 });
    positionY.value = withTiming(centerY, { duration: 300 });
  };

  // region tap gesture

  // Double tap gesture ref so we can detect a double tap failure
  const doubleTapRef = React.useRef<GestureType | undefined>();

  /**
   * Toggles the accessories
   */
  const onTap = (): void => {
    // If the scale is not equal to one, do nothing
    if (scale.value !== 1) return;

    setAccessoriesVisible((prev) => !prev);
  };

  const tapGesture = Gesture.Tap()
    .requireExternalGestureToFail(doubleTapRef) // Wait for the double tap to fail
    .maxDeltaY(10)
    .maxDeltaX(10)
    .onEnd(onTap);

  /**
   * Zooms the image in or out on double tap
   */
  const onDoubleTap = (): void => {
    'worklet';

    // Make sure the accessories are hidden
    runOnJS(setAccessoriesVisible)(false);

    // If the scale is not equal to one, we reset
    if (scale.value !== 1) {
      centerImage();
      scale.value = withTiming(1, { duration: 200 });
      lastScale.value = 1;
      return;
    }

    // Zoom in to 1.75
    scale.value = withTiming(1.75, { duration: 200 });
    lastScale.value = 1.75;
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .maxDuration(250)
    .maxDistance(25)
    .withRef(doubleTapRef)
    .onEnd(onDoubleTap);

  // endregion

  // region pan gesture

  /**
   * Resets pan gesture values when the pan starts
   */
  const onPanStart = (): void => {
    'worklet';

    lastTranslateX.value = 0;
    lastTranslateY.value = 0;
  };

  const onPanUpdate = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ): void => {
    'worklet';
    // Move the image by the difference in translation
    positionX.value += e.translationX - lastTranslateX.value;
    positionY.value += e.translationY - lastTranslateY.value;

    // Store the last translations
    lastTranslateX.value = e.translationX;
    lastTranslateY.value = e.translationY;

    // We have some animations to run if the scale is one
    if (scale.value <= 1) {
      const absTranslateY = Math.abs(e.translationY);

      const opacity = 1 - absTranslateY / 800;
      backgroundColor.value = `rgba(0, 0, 0, ${opacity})`;
    }
  };

  const onPanEnd = (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ): void => {
    'worklet';
    // First, see if we just want to dismiss the viewer.
    const velocity = Math.abs(e.velocityY);
    const translationX = Math.abs(e.translationX);

    // Dismiss the viewer if the scale is one and the velocity is high enough
    if (scale.value <= 1) {
      if (velocity > 800 && translationX < 100) {
        runOnJS(closeViewer)();
        return;
      }

      backgroundColor.value = withTiming('rgba(0, 0, 0, 1)', { duration: 200 });
    }

    // Calculate the dimensions of the image at the current scale
    const h = fullHeight * scale.value;
    const w = fullWidth * scale.value;

    // What is furthest the image can be moved in the x or y direction?🤔
    // Probably should add a *bit* of padding to the x (the Y is already fine since we have capped the height at 90%)
    const maxX = ((scale.value - 1) * fullWidth) / 2;
    const maxY = ((scale.value - 1) * fullHeight) / 2;

    // If the image's width is less than the screen width, we just bring it back to the center. 😁
    if (w < SCREEN_WIDTH) {
      positionX.value = withTiming(centerX, { duration: 400 });
    } else if (Math.abs(positionX.value) > maxX) {
      // Oops, 😅 We went too far in the x direction. Bring it back
      positionX.value = withTiming(
        Math.sign(positionX.value) === 1 ? maxX : -maxX,
        { duration: 400 },
      );

      runOnJS(runImpact)();
    } else {
      // Otherwise, we 👌 Just gotta give it a bit of🗜️ clamp
      positionX.value = withDecay({
        velocity: (e.velocityX * 1.5) / scale.value,
        clamp: [-maxX, maxX],
        rubberBandEffect: true,
        // @ts-expect-error TODO fix this type, reanimated update...
        rubberBandFactor: 2,
        velocityFactor: 0.5 * scale.value,
      });

      runOnJS(runImpact)();
    }
    // Same for Y 😎

    if (h < SCREEN_HEIGHT) {
      positionY.value = withTiming(centerY, { duration: 400 });
    } else if (Math.abs(positionY.value) > maxY) {
      // Oops, 😅 We went too far in the x direction. Bring it back
      positionY.value = withTiming(
        Math.sign(positionY.value) === 1 ? maxY : -maxY,
        { duration: 400 },
      );
      runOnJS(runImpact)();
    } else {
      // Otherwise, we 👌 Just gotta give it a bit of🗜️ clamp
      positionY.value = withDecay({
        velocity: (e.velocityY * 1.5) / scale.value,
        clamp: [-maxY, maxY],
        rubberBandEffect: true,
        // @ts-expect-error TODO fix this type, reanimated update...
        rubberBandFactor: 2,
        velocityFactor: 0.5 * scale.value,
      });

      runOnJS(runImpact)();
    }
  };

  const panGesture = Gesture.Pan()
    .maxPointers(2)
    .onStart(onPanStart)
    .onUpdate(onPanUpdate)
    .onEnd(onPanEnd);

  // endregion

  // region pinch gesture

  const onPinchStart = (): void => {
    'worklet';

    runOnJS(setAccessoriesVisible)(false);
  };

  const onPinchUpdate = (
    e: GestureUpdateEvent<PinchGestureHandlerEventPayload>,
  ): void => {
    'worklet';

    // Increase the zoom
    scale.value = lastScale.value * e.scale;
  };

  const onPinchEnd = (): void => {
    'worklet';

    // If the scale is below one, reset
    if (scale.value < 1) {
      // Play a haptic
      runOnJS(runImpact)();

      // Set the scale to one
      scale.value = withTiming(1, { duration: 200 });
      lastScale.value = 1;

      // Center image
      centerImage();

      return;
    } else if (scale.value > 3) {
      // Do the same if the scale is above 3
      runOnJS(runImpact)();

      scale.value = withTiming(3, { duration: 200 });
      lastScale.value = 3;

      return;
    }

    // Save the last scale
    lastScale.value = scale.value;
  };

  const pinchGesture = Gesture.Pinch()
    .onStart(onPinchStart)
    .onUpdate(onPinchUpdate)
    .onEnd(onPinchEnd);

  // endregion

  const tapGestures = Gesture.Simultaneous(tapGesture, doubleTapGesture);
  const pinchAndPanGestures = Gesture.Simultaneous(pinchGesture, panGesture);
  const allGestures = Gesture.Exclusive(pinchAndPanGestures, tapGestures);

  // region animated styles
  /**
   * Handles the translation of the image's position
   * @type {{transform: ({translateX: number} | {translateY: number})[]}}
   */
  const positionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  /**
   * Handles the opacity of the background
   * @type {{backgroundColor: string}}
   */
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dimensionsStyle = useAnimatedStyle(() => ({
    height: height.value,
    width: width.value,
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: accessoryOpacity.value,
  }));

  // endregion

  return (
    <View style={styles.container}>
      <Animated.View style={opacityStyle}>
        <ImageViewerHeader visible={accessoriesVisible} onClose={closeViewer} />
      </Animated.View>
      <GestureDetector gesture={allGestures}>
        <Animated.View style={[styles.imageContainer, backgroundStyle]}>
          <Animated.View style={[positionStyle]}>
            <AnimatedImage
              source={currentImage.thumb}
              style={[dimensions, scaleStyle, dimensionsStyle]}
              cachePolicy="memory-disk"
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <Animated.View style={opacityStyle}>
        <ImageViewerFooter visible={accessoriesVisible} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imageContainer: {
    flex: 1,
    zIndex: -1,
  },
});

export default React.memo(gestureHandlerRootHOC(ImageViewer));
