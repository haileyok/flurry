import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
} from 'react-native';
import { useNav } from '@src/hooks/useNav';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { RouteProp, useRoute } from '@react-navigation/core';
import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyRichtextFacet,
  RichText,
} from '@atproto/api';
import { Text } from 'tamagui';
import { IPerson } from '@src/types/data';
import * as ImagePicker from 'expo-image-picker';
import MainButton from '@src/components/Common/Button/MainButton';
import { SelectedImage } from '@src/components/NewPost/components/SelectedImages';
import { shortenLinks } from '@src/lib/link/shortenLinks';
import { compressImage, saveImageToDisk } from '@src/lib/image';
import { useStateDebounced } from '@src/hooks/useStateDebounced';
import { IGiphyGif } from '@src/types';
import { useClient } from '@root/App';
import { useQueryClient } from '@tanstack/react-query';

interface Selection {
  start: number;
  end: number;
}

interface UseNewPostScreen {
  text: RichText;
  decoratedText: React.JSX.Element[];

  selection: React.MutableRefObject<Selection>;
  inputRef: React.MutableRefObject<TextInput | null>;

  giphySheetOpen: boolean;
  setGiphySheetOpen: React.Dispatch<SetStateAction<boolean>>;
  onOpenGiphySheet: () => void;
  onSelectGif: (gif: IGiphyGif) => void;

  onPersonSelect: (person: IPerson) => void;

  onChangeText: (text: string) => void;
  onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  personTerm: string;

  onAddFromGalleryPress: () => Promise<void>;
  onAddFromCameraPress: () => Promise<void>;
  onSetAltText: (index: number, text: string) => void;
  onRemoveImage: (index: number) => void;

  selectedImages: SelectedImage[];

  loading: boolean;
}

export const useNewPostScreen = (): UseNewPostScreen => {
  const client = useClient();
  const queryClient = useQueryClient();

  const navigation = useNav<MainStackParamList>();
  const { replyTo, quote } =
    useRoute<RouteProp<MainStackParamList, 'NewPost'>>().params ?? {};

  const [text, setText] = useState<RichText>(new RichText({ text: '' }));
  const [loading, setLoading] = useState(false);
  const {
    state: [personTerm, setPersonTerm],
    debounceChange: onPersonTermChange,
  } = useStateDebounced('', 300);

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  const [giphySheetOpen, setGiphySheetOpen] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const selection = useRef<Selection>({ start: 0, end: 0 });
  const plainText = useRef<string>('');

  // So that we don't excessively re-render the Post button, we will use the plain text from the `plainText` ref. Since
  // we don't have the updated `text` here, we have to create the RichText again.
  // As long as we do this, we only re-render once per keystroke. (Well, twice if you include the character count)
  // Use logic from https://github.com/bluesky-social/social-app/blob/019aae5f01cb7b503d242917ae0092c2818f3b71/src/lib/api/index.ts
  const onSubmitPress = useCallback(async (): Promise<void> => {
    setLoading(true);

    let embed:
      | AppBskyEmbedImages.Main
      | AppBskyEmbedExternal.Main
      | AppBskyEmbedRecord.Main
      | AppBskyEmbedRecordWithMedia.Main
      | undefined;

    // Create rich text
    let richText = new RichText({ text: plainText.current });
    await richText.detectFacets(client.client!);
    richText = shortenLinks(richText);

    richText.facets = richText.facets?.filter((facet) => {
      const mention = facet.features.find((feature) =>
        AppBskyRichtextFacet.isMention(feature),
      );
      return !(mention && !mention.did);
    });

    // TODO
    // add quote embed if present

    if (quote != null) {
      embed = {
        $type: 'app.bsky.embed.record',
        record: {
          uri: quote.uri,
          cid: quote.cid,
        },
      };
    }

    if (selectedImages.length > 0) {
      const images: AppBskyEmbedImages.Image[] = [];

      for (const image of selectedImages) {
        const res = await client.uploadImage((await compressImage(image)).uri);

        images.push({
          image: res.blob,
          alt: image.alt.trim(),
          aspectRatio: { width: image.width, height: image.height },
        });

        // If there's a quote, but there wont be right now
        // TODO
      }

      if (quote != null) {
        embed = {
          $type: 'app.bsky.embed.recordWithMedia',
          record: embed,
          media: {
            $type: 'app.bsky.embed.images',
            images,
          },
        } as AppBskyEmbedRecordWithMedia.Main;
      } else {
        embed = {
          $type: 'app.bsky.embed.images',
          images,
        } as AppBskyEmbedImages.Main;
      }
    }

    // Good to go
    try {
      // Submit the post
      await client.createPost({
        text: richText.text,
        facets: richText.facets,
        tags: undefined,
        langs: ['en'], // TODO offer options. get from settings?
        reply:
          replyTo != null
            ? {
                root: {
                  cid: replyTo?.replyRef?.root.cid ?? replyTo.cid,
                  uri: replyTo?.replyRef?.root.uri ?? replyTo.uri,
                },
                parent: {
                  cid: replyTo.cid,
                  uri: replyTo.uri,
                },
              }
            : undefined,
        embed,
      });

      // Invalidate the profile and post queries
      await queryClient.invalidateQueries({
        queryKey: ['profile', client.getUserId()],
      });
      await queryClient.invalidateQueries({ queryKey: ['post'], exact: false });
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'An error occurred while submitting the post.');
      return;
    }

    setLoading(false);

    navigation.pop();
  }, [navigation, replyTo, selectedImages]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MainButton label="Post" onPress={onSubmitPress} highlight />
      ),
    });
  }, [navigation, onSubmitPress, selectedImages]);

  const onPersonSelect = useCallback(
    (person: IPerson) => {
      const currentText = plainText.current;

      const newText = currentText.replace(
        new RegExp('@' + personTerm),
        `@${person.handle}`,
      );

      setText(new RichText({ text: newText }));

      setTimeout(() => {
        inputRef.current?.setNativeProps({
          selection: {
            start: newText.length,
            end: newText.length,
          },
        });

        setPersonTerm('');
      }, 100);
    },
    [personTerm, setPersonTerm],
  );

  const onChange = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const { text } = e.nativeEvent;

      const currentWord = text.split(' ').pop();

      if (currentWord?.startsWith('@')) {
        onPersonTermChange(currentWord.slice(1));
      } else if (personTerm !== '') {
        setPersonTerm('');
      }
    },
    [onPersonTermChange, personTerm, setPersonTerm],
  );

  /** https://github.com/bluesky-social/social-app/blob/019aae5f01cb7b503d242917ae0092c2818f3b71/src/view/com/composer/text-input/TextInput.tsx **/
  const onChangeText = useCallback(
    (text: string) => {
      plainText.current = text;

      const richText = new RichText({ text });
      richText.detectFacetsWithoutResolution();
      setText(richText);
    },
    [setText],
  );

  const decoratedText = useMemo(() => {
    let i = 0;

    return Array.from(text.segments()).map((segment) => {
      const isTag = AppBskyRichtextFacet.isTag(segment.facet?.features?.[0]);

      return (
        <Text
          key={i++}
          fontSize="$3"
          color={segment.facet != null && !isTag ? '$accent' : '$color'}
        >
          {segment.text}
        </Text>
      );
    });
  }, [text]);

  const onAddFromGalleryPress = useCallback(async () => {
    // Get permissions first
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      Alert.alert('Error', 'You must grant permission to access your photos.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: 4 - selectedImages.length,
    });

    if (res.canceled || res.assets.length < 0) return;

    setSelectedImages((prev) => [
      ...prev,
      ...res.assets.map((a) => ({
        uri: a.uri,
        height: a.height,
        width: a.width,
        filename: a.fileName,
        size: (a.fileSize ?? 0) / 1000,
        alt: '',
      })),
    ]);
  }, [selectedImages]);

  const onAddFromCameraPress = useCallback(async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      Alert.alert('Error', 'You must grant permission to access your camera.');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: 4 - selectedImages.length,
    });

    if (res.canceled || res.assets.length < 0) return;

    setSelectedImages((prev) => [
      ...prev,
      ...res.assets.map((a) => ({
        uri: a.uri,
        height: a.height,
        width: a.width,
        filename: a.fileName,
        alt: '',
        size: (a.fileSize ?? 0) / 1000,
      })),
    ]);
  }, [selectedImages]);

  const onSetAltText = useCallback((index: number, text: string) => {
    setSelectedImages((prev) => {
      const copy = [...prev];
      copy[index].alt = text;
      return copy;
    });
  }, []);

  const onRemoveImage = useCallback((index: number) => {
    setSelectedImages((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }, []);

  const onOpenGiphySheet = useCallback(() => {
    inputRef?.current?.blur();
    setGiphySheetOpen(true);
  }, []);

  const onSelectGif = useCallback(
    async (gif: IGiphyGif) => {
      setLoading(true);

      try {
        // Download the still image
        const fileName = gif.url.split('/').pop();
        const res = await saveImageToDisk(gif.stillUrl, `${gif.id}.gif`);

        setSelectedImages((prev) => [
          ...prev,
          {
            uri: res.uri,
            height: gif.dimensions.height,
            width: gif.dimensions.width,
            filename: fileName!,
            size: res.size / 1000,
            alt: gif.alt,
          },
        ]);

        onChangeText(`${plainText.current} ${gif.url}`);

        setGiphySheetOpen(false);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    },
    [onChangeText],
  );

  return {
    text,
    decoratedText,

    inputRef,
    selection,

    giphySheetOpen,
    setGiphySheetOpen,
    onOpenGiphySheet,
    onSelectGif,

    personTerm,

    onPersonSelect,

    onChangeText,
    onChange,

    onAddFromGalleryPress,
    onAddFromCameraPress,
    onSetAltText,
    onRemoveImage,

    selectedImages,

    loading,
  };
};
