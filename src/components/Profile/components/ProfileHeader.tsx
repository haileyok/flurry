import React, { useCallback } from 'react';
import { IPerson } from '@src/types/data';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { Text, View } from 'tamagui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { useNav } from '@src/hooks/useNav';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ellipsis from '@src/components/Common/BlahBlahBlah/Ellipsis';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface IProps {
  person?: IPerson;
  scrollOffset: SharedValue<number>;
}

export default function ProfileHeader({
  person,
  scrollOffset,
}: IProps): React.JSX.Element {
  const navigation = useNav<MainStackParamList>();
  const insets = useSafeAreaInsets();

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollOffset.value,
      [0, 180],
      [200, insets.top + 40],
      Extrapolation.CLAMP,
    ),
  }));

  const headerTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [80, 180],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [0, 180],
      [0, 0.8],
      Extrapolation.CLAMP,
    ),
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollOffset.value,
          [0, 180],
          [1, 0.5],
          Extrapolation.CLAMP,
        ),
      },
    ],
    top: interpolate(
      scrollOffset.value,
      [0, 180],
      [150, insets.top - 40],
      Extrapolation.CLAMP,
    ),
    left: interpolate(
      scrollOffset.value,
      [0, 180],
      [20, 50],
      Extrapolation.CLAMP,
    ),
  }));

  /*
   * Waiting on Expo to merge in fix for resizing images. We would rather just use an animated image as opposed to an
   * animated image background here for the banner. However, there is a memory leak current when resizing the image.
   *
   * Trying to update the image style on the banner results in the same memory leak, so we cannot do that.
   *
   * Instead, we will create a view that fills the entire banner area and animate the opacity of that view.
   *
   * Need to set both the back button and the avatar to zIndex 2 so that they are displayed above the banner.
   */
  return (
    <>
      <Animated.View style={[headerStyle, styles.container]}>
        <AnimatedImageBackground
          source={person?.banner}
          style={[{ height: 200, width: SCREEN_WIDTH }, headerStyle]}
          recyclingKey={person?.banner}
        >
          <Animated.View
            style={[headerStyle, opacityStyle, styles.background]}
          />
          <View
            backgroundColor="rgba(0,0,0,0.7)"
            borderRadius={100}
            height={38}
            width={38}
            position="absolute"
            top={insets.top - 10}
            left={20}
            alignItems="center"
            justifyContent="center"
            onPress={onBackPress}
            hitSlop={5}
            zIndex={2}
          >
            <ChevronLeft size={30} style={{ marginRight: 3 }} color="white" />
          </View>
          <AnimatedImage
            source={person?.avatar}
            style={[styles.avatar, avatarStyle]}
          />
          <Animated.View
            style={[styles.textContainer, { top: insets.top }, headerTextStyle]}
          >
            <Text
              fontSize="$4"
              fontWeight="bold"
              marginLeft="40%"
              numberOfLines={1}
              color="white"
            >
              {person?.displayName}
            </Text>
          </Animated.View>
          <View
            backgroundColor="rgba(0,0,0,0.7)"
            borderRadius={100}
            height={38}
            width={38}
            position="absolute"
            top={insets.top - 10}
            right={20}
            alignItems="center"
            justifyContent="center"
            onPress={onBackPress}
            hitSlop={5}
            zIndex={2}
          >
            <Ellipsis size={24} color="white" />
          </View>
        </AnimatedImageBackground>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },

  avatar: {
    height: 100,
    width: 100,
    borderRadius: 100,
    zIndex: 2,
  },

  background: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'black',
    ...StyleSheet.absoluteFillObject,
  },

  textContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
});
