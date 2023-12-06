import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

function ImageViewerHeaderInner({
  visible,
  onClose,
}: IProps): React.JSX.Element | null {
  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Pressable style={styles.exitContainer} onPress={onClose} hitSlop={10}>
        <Ionicons name="close-outline" size={30} color="white" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    height: 120,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  contentContainer: {
    flex: 1,
    top: 80,
    paddingHorizontal: 25,
  },

  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },

  exitContainer: {
    zIndex: 2,
    position: 'absolute',
    top: 55,
    right: 10,
    height: 30,
    width: 30,
    borderRadius: 20,
  },

  exitText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export const ImageViewerHeader = React.memo(ImageViewerHeaderInner);
