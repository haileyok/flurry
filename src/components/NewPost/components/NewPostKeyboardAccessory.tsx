import React from 'react';
import { InputAccessoryView } from 'react-native';
import { useTheme, XStack } from 'tamagui';
import { Camera, Image } from '@tamagui/lucide-icons';
import CharacterCountWheel from '@src/components/NewPost/components/CharacterCountWheel';
import PressInAnimation from '@src/components/Common/Animation/PressInAnimation';
import Gif from '@src/components/Common/BlahBlahBlah/Gif';

interface IProps {
  characterCount: number;
  onAddFromGalleryPress: () => Promise<void>;
  onAddFromCameraPress: () => Promise<void>;
  onOpenGiphySheet: () => void;
}

export default function NewPostKeyboardAccessory({
  characterCount,
  onAddFromGalleryPress,
  onAddFromCameraPress,
  onOpenGiphySheet,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <InputAccessoryView nativeID="newPostAccessory">
      <XStack
        borderColor="$border"
        borderTopWidth={1}
        borderBottomWidth={1}
        backgroundColor="$bg"
        height={44}
        paddingLeft="$3"
        alignItems="center"
        space="$3"
      >
        <PressInAnimation onPress={onAddFromCameraPress}>
          <Camera color="$accent" size={30} />
        </PressInAnimation>
        <PressInAnimation onPress={onAddFromGalleryPress}>
          <Image color="$accent" size={30} />
        </PressInAnimation>
        <PressInAnimation onPress={onOpenGiphySheet}>
          <Gif color={theme.accent.val as string} size={30} />
        </PressInAnimation>
        <CharacterCountWheel characterCount={characterCount} />
      </XStack>
    </InputAccessoryView>
  );
}
