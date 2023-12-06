import React, { useMemo } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useImageViewer } from '@src/lib/imageViewer/ImageViewerContext';
import { Text, YStack } from 'tamagui';
import { useExpandText } from '@src/lib/expandText/useExpandText';

interface IProps {
  visible: boolean;
}

function ImageViewerFooterInner({ visible }: IProps): React.JSX.Element | null {
  const imageViewer = useImageViewer();
  const { images, imageIndex } = imageViewer.state.params;
  const currentImage = useMemo(() => images[imageIndex], [images, imageIndex]);

  const expandText = useExpandText(currentImage.alt, 3);

  if (!visible || currentImage.alt == null) return null;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <YStack
        zIndex={1}
        position="absolute"
        width="100%"
        backgroundColor="rgba(0,0,0,0.8)"
        bottom={0}
        height={(expandText.numberOfLines ?? 3) * 20 + 45}
        paddingTop="$2"
        paddingHorizontal="$3"
        onPress={expandText.toggle}
        hitSlop={3}
      >
        <Text
          fontSize="$3"
          flex={1}
          numberOfLines={expandText.numberOfLines}
          onTextLayout={expandText.onTextLayout}
        >
          {currentImage.alt}
        </Text>
      </YStack>
    </Animated.View>
  );
}

export const ImageViewerFooter = React.memo(ImageViewerFooterInner);
