import React, { useCallback, useRef } from 'react';
import { ScrollView, TextArea, useTheme, View, XStack, YStack } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import NewPostKeyboardAccessory from '@src/components/NewPost/components/NewPostKeyboardAccessory';
import { useNewPostScreen } from '@src/components/NewPost/hooks/useNewPostScreen';
import FeedPost from '@src/components/Common/Post/postTypes/FeedPost';
import {
  NativeSyntheticEvent,
  ScrollView as RNScrollView,
  TextInputSelectionChangeEventData,
} from 'react-native';
import LoadingOverlay from '@src/components/Common/Loading/LoadingOverlay';
import Avatar from '@src/components/Common/Profile/Avatar';
import PersonDropdown from '@src/components/NewPost/components/PersonDropdown';
import SelectedImages from '@src/components/NewPost/components/SelectedImages';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { useAvoidSoftView } from '@src/hooks/useAvoidSoftView';
import { useSelfQuery } from '@src/api/queries/bsky/usePersonQuery';
import GiphySheet from '@src/components/NewPost/components/GiphySheet';
import EmbeddedPost from '@src/components/Common/EmbeddedPost/EmbeddedPost';
import { useClient } from '@root/App';

export default function NewPostScreen({
  route,
}: NativeStackScreenProps<MainStackParamList, 'NewPost'>): React.JSX.Element {
  const { replyTo, quote } = route.params ?? {};
  const theme = useTheme();

  const client = useClient();

  const { data: profile } = useSelfQuery(client);

  useAvoidSoftView();
  const scrollViewRef = useRef<RNScrollView>(null);

  const {
    text,
    decoratedText,
    selection,
    inputRef,
    giphySheetOpen,
    setGiphySheetOpen,
    onOpenGiphySheet,
    onSelectGif,
    onPersonSelect,
    onChangeText,
    onChange,
    onAddFromGalleryPress,
    onAddFromCameraPress,
    onSetAltText,
    onRemoveImage,
    selectedImages,
    personTerm,
    loading,
  } = useNewPostScreen();

  const onSelectionChange = useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      selection.current = e.nativeEvent.selection;
    },
    [selection],
  );

  return (
    <AvoidSoftInputView style={{ flex: 1 }}>
      <ScrollView
        flex={1}
        backgroundColor="$bg"
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <LoadingOverlay visible={loading} />
        <YStack backgroundColor="$bg" flex={1}>
          {replyTo != null && (
            <FeedPost
              post={replyTo}
              showEmbeddedPosts={false}
              showMetrics={false}
              drawBottomLine
            />
          )}

          <XStack paddingHorizontal="$2">
            <YStack alignItems="center">
              <View
                height={14}
                width={2}
                backgroundColor={replyTo != null ? '$border' : 'transparent'}
              />
              <Avatar avatar={profile?.avatar} pressAction="none" />
            </YStack>
            <TextArea
              placeholder="What's going on?"
              placeholderTextColor="$secondary"
              fontSize="$3"
              inputAccessoryViewID="newPostAccessory"
              flex={1}
              onChangeText={onChangeText}
              onChange={onChange}
              onSelectionChange={onSelectionChange}
              autoFocus={true}
              ref={inputRef}
              borderWidth={0}
              borderTopColor={undefined} // Seems to be an issue with Tamagui TextArea. Set this to undefined so there's no error
              keyboardAppearance={theme.colorScheme.val as 'light' | 'dark'}
              onLayout={() => {
                scrollViewRef.current?.scrollToEnd();
              }}
              minHeight={90}
              paddingHorizontal="$2"
            >
              {decoratedText}
            </TextArea>
          </XStack>
          <PersonDropdown term={personTerm} onSelect={onPersonSelect} />
          <SelectedImages
            selectedImages={selectedImages}
            onSetAltText={onSetAltText}
            onRemoveImage={onRemoveImage}
          />
          {quote != null && <EmbeddedPost post={quote} />}
        </YStack>
        <GiphySheet
          onSelectGif={onSelectGif}
          open={giphySheetOpen}
          setOpen={setGiphySheetOpen}
        />
        <NewPostKeyboardAccessory
          characterCount={text.length}
          onAddFromCameraPress={onAddFromCameraPress}
          onAddFromGalleryPress={onAddFromGalleryPress}
          onOpenGiphySheet={onOpenGiphySheet}
        />
      </ScrollView>
    </AvoidSoftInputView>
  );
}
