import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View, XStack, YStack } from 'tamagui';
import { IImage } from '@src/types/data';
import { ViewerImage } from '@src/lib/imageViewer';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DOUBLE_WIDTH = SCREEN_WIDTH * 0.35;

interface IProps {
  images: IImage[];
  layoutWidth?: number;
}

function PostImagesInner({ images, layoutWidth }: IProps): React.JSX.Element {
  const width = layoutWidth ? layoutWidth / 2 : DOUBLE_WIDTH;

  if (images.length > 1 && images.length < 4) {
    return (
      <XStack>
        <View borderRightWidth={1} borderRightColor="$inverse">
          <ViewerImage
            images={images}
            imageIndex={0}
            style={[styles.doubleImage, styles.imageLeft]}
            defaultDimensions={{
              height: width,
              width,
            }}
            contentFit="cover"
          />
        </View>

        <View borderLeftWidth={1} borderRightColor="$inverse">
          <ViewerImage
            images={images}
            imageIndex={1}
            style={[styles.doubleImage, styles.imageRight]}
            defaultDimensions={{
              height: width,
              width,
            }}
            contentFit="cover"
          />
        </View>
      </XStack>
    );
  }

  if (images.length >= 4) {
    return (
      <>
        <XStack>
          <View
            borderRightWidth={1}
            borderRightColor="$inverse"
            borderBottomWidth={1}
            borderBottomColor="$inverse"
          >
            <ViewerImage
              images={images}
              imageIndex={0}
              style={[styles.imageLeft, styles.imageTopLeft]}
              defaultDimensions={{
                height: width,
                width,
              }}
              contentFit="cover"
            />
          </View>

          <View
            borderLeftWidth={1}
            borderLeftColor="$inverse"
            borderBottomWidth={1}
            borderBottomColor="$inverse"
          >
            <ViewerImage
              images={images}
              imageIndex={1}
              style={[styles.imageRight, styles.imageTopRight]}
              defaultDimensions={{
                height: width,
                width,
              }}
              contentFit="cover"
            />
          </View>
        </XStack>
        <XStack>
          <View
            borderRightWidth={1}
            borderRightColor="$inverse"
            borderTopWidth={1}
            borderTopColor="$inverse"
          >
            <ViewerImage
              images={images}
              imageIndex={2}
              style={[styles.imageLeft, styles.imageBottomLeft]}
              defaultDimensions={{
                height: width,
                width,
              }}
              contentFit="cover"
            />
          </View>
          <View
            borderLeftWidth={1}
            borderLeftColor="$inverse"
            borderTopWidth={1}
            borderTopColor="$inverse"
          >
            <ViewerImage
              images={images}
              imageIndex={3}
              style={[styles.imageRight, styles.imageBottomRight]}
              defaultDimensions={{
                height: width,
                width,
              }}
              contentFit="cover"
            />
          </View>
        </XStack>
      </>
    );
  }

  return (
    <ViewerImage
      images={images}
      imageIndex={0}
      heightModifier={0.5}
      widthModifier={0.7}
    />
  );
}

export default function PostImages({ images }: IProps): React.JSX.Element {
  return (
    <YStack marginVertical="$3">
      <PostImagesInner images={images} />
    </YStack>
  );
}

const styles = StyleSheet.create({
  doubleImage: {
    height: 130,
    width: DOUBLE_WIDTH,
    borderRadius: 10,
  },

  imageLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  imageTopLeft: {
    borderBottomLeftRadius: 0,
  },

  imageBottomLeft: {
    borderTopLeftRadius: 0,
  },

  imageRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  imageTopRight: {
    borderBottomRightRadius: 0,
  },

  imageBottomRight: {
    borderTopRightRadius: 0,
  },
});
