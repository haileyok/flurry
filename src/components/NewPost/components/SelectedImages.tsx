import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sheet, Text, TextArea, View, XStack } from 'tamagui';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TextInput,
} from 'react-native';
import { ImageBackground } from 'expo-image';
import { Check, Plus, Trash } from '@tamagui/lucide-icons';
import MainButton from '@src/components/Common/Button/MainButton';
import { getTextFromImageAsync } from '@root/modules/expo-ios-image-to-text';

export interface SelectedImage {
  uri: string;
  height: number;
  width: number;
  filename?: string | null;
  alt: string;
  size: number;
}

interface IProps {
  selectedImages: SelectedImage[];
  onSetAltText: (index: number, alt: string) => void;
  onRemoveImage: (index: number) => void;
}

const keyExtractor = (item: SelectedImage): string => {
  return item.uri;
};

function SelectedImages({
  selectedImages,
  onRemoveImage,
  onSetAltText,
}: IProps): React.JSX.Element | null {
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SelectedImage>): React.JSX.Element => {
      return (
        <SelectedImageItem
          selectedImage={item}
          onSetAltText={onSetAltText}
          onRemoveImage={onRemoveImage}
          index={index}
        ></SelectedImageItem>
      );
    },
    [onRemoveImage, onSetAltText],
  );

  if (selectedImages.length === 0) return null;

  return (
    <XStack height={250} width="100%">
      <FlatList
        renderItem={renderItem}
        data={selectedImages}
        keyExtractor={keyExtractor}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </XStack>
  );
}

interface ISelectedImageProps {
  selectedImage: SelectedImage;
  onSetAltText: (index: number, alt: string) => void;
  onRemoveImage: (index: number) => void;
  index: number;
}

function SelectedImageItem({
  selectedImage,
  onSetAltText,
  onRemoveImage,
  index,
}: ISelectedImageProps): React.JSX.Element {
  const [sheetOpen, setSheetOpen] = useState(false);
  const currentAltText = useRef(selectedImage.alt);

  // This feels hacky. Hopefully we can find a better way. Passing a ref up is *possible* but again, not great.
  const textAreaRef = useRef<TextInput>(null);
  useEffect(() => {
    if (sheetOpen) {
      textAreaRef.current?.focus();
    }
  }, [sheetOpen]);

  const onChangeText = useCallback((text: string) => {
    currentAltText.current = text;
  }, []);

  const onAutoGenerateAltText = useCallback(async () => {
    const res = await getTextFromImageAsync(selectedImage.uri);

    if (res != null) {
      currentAltText.current = res.join('\n');
      textAreaRef.current?.setNativeProps({ text: res.join('\n') });
    }
  }, [selectedImage.uri]);

  const onSaveAltText = useCallback(() => {
    onSetAltText(index, currentAltText.current);
    setSheetOpen(false);
  }, [index, onSetAltText]);

  return (
    <ImageBackground
      source={selectedImage.uri}
      imageStyle={styles.image}
      contentFit="contain"
      style={styles.image}
    >
      <View
        position="absolute"
        top={5}
        right={1}
        paddingHorizontal="$2"
        height={30}
        alignItems="center"
        justifyContent="center"
        backgroundColor="rgba(0,0,0,0.9)"
        borderRadius="$2"
        onPress={() => onRemoveImage(index)}
        hitSlop={3}
      >
        <Trash size={18} />
      </View>
      <XStack
        position="absolute"
        top={5}
        left={11}
        padding="$2"
        height={30}
        backgroundColor="rgba(0,0,0,0.9)"
        borderRadius="$2"
        alignItems="center"
        justifyContent="center"
        onPress={() => setSheetOpen(true)}
        hitSlop={3}
        space="$1"
      >
        <Text>ALT</Text>
        {selectedImage.alt ? <Check size={18} /> : <Plus size={18} />}
      </XStack>
      <Sheet
        snapPoints={[310]}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        snapPointsMode="constant"
        moveOnKeyboardChange
        animation="fast"
        modal
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame backgroundColor="$fg" padding="$2" space="$2">
          <TextArea
            placeholder="Alt text describes images for blind and low-vision users, and helps give context to everyone."
            placeholderTextColor="$secondary"
            fontSize="$3"
            borderWidth={0}
            borderColor={undefined}
            defaultValue={selectedImage.alt}
            minHeight={100}
            maxHeight={200}
            onChangeText={onChangeText}
            ref={textAreaRef}
            autoComplete="off"
          />
          <XStack
            marginTop="auto"
            marginBottom={10}
            marginLeft="auto"
            marginRight={10}
            space="$2"
          >
            <MainButton
              label="Auto-Generate Alt Text"
              onPress={onAutoGenerateAltText}
              highlight
            />
            <MainButton
              label="Set Alt Text"
              onPress={onSaveAltText}
              highlight
            />
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: 250,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});

export default React.memo(SelectedImages);
