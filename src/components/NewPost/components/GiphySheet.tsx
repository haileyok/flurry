import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Input, Sheet, View, XStack, YStack } from 'tamagui';
import { IGiphyGif } from '@src/types';
import { ListRenderItemInfo, MasonryFlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { giphySearch, giphyTrending } from '@src/lib/giphy';
import { Dimensions, StyleSheet } from 'react-native';
import { createNewDimensions } from '@src/lib/image';
import { useStateDebounced } from '@src/hooks';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface IProps {
  onSelectGif: (gif: IGiphyGif) => void;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const keyExtractor = (item: IGiphyGif): string => {
  return item.url;
};

export default function GiphySheet({
  onSelectGif,
  open,
  setOpen,
}: IProps): React.JSX.Element {
  const [results, setResults] = useState<IGiphyGif[]>([]);
  const isInitialized = useRef(false);
  const {
    state: [term],
    debounceChange: onChangeText,
  } = useStateDebounced('', 500);

  // When the sheet is opened for the first time, load the results
  useEffect(() => {
    const loadTrending = async (): Promise<void> => {
      const gifs = await giphyTrending();
      setResults(gifs);
    };

    if (!isInitialized.current && open) {
      isInitialized.current = true;
      void loadTrending();
    }
  }, [open]);

  useEffect(() => {
    const search = async (): Promise<void> => {
      // Search for the gifs
      const gifs = await giphySearch(term);

      setResults(gifs);
    };

    if (term) {
      void search();
    }
  }, [term]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<IGiphyGif>): React.JSX.Element => {
      const dimensions = createNewDimensions(
        item.dimensions,
        SCREEN_WIDTH / 2 - 16,
      );

      return (
        <View
          alignItems="center"
          justifyContent="center"
          paddingVertical="$1"
          onPress={() => onSelectGif(item)}
          hitSlop={3}
        >
          <Image
            source={item.url}
            style={[dimensions, styles.image]}
            cachePolicy="none"
            recyclingKey={item.url}
          />
        </View>
      );
    },
    [onSelectGif],
  );

  return (
    <Sheet
      snapPoints={[80]}
      open={open}
      onOpenChange={setOpen}
      animation="fast"
      disableDrag
      modal
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame backgroundColor="$fg" padding="$2" space="$2">
        <YStack flex={1}>
          <MasonryFlashList
            data={results}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={150}
            keyboardShouldPersistTaps="never"
            ListHeaderComponent={
              <XStack paddingVertical="$2">
                <Input
                  placeholder="Search GIPHY"
                  width="100%"
                  borderColor="$border"
                  onChangeText={onChangeText}
                  clearButtonMode="always"
                  autoCapitalize="none"
                  autoCorrect={false}
                  backgroundColor="$fg2"
                  height={35}
                  autoFocus={false}
                />
              </XStack>
            }
          />
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
  },
});
