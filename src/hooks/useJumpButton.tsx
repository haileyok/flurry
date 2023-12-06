import { IConfigPair, ViewableItemsChanged, ViewToken } from '@src/types';
import { MutableRefObject, RefObject, useCallback, useRef } from 'react';
import { IPost } from '@src/types/data';
import {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { playHaptic } from '@src/lib';
import { FlashList } from '@shopify/flash-list';
import { useLikeRepostMutation } from '@src/api/queries/bsky/useLikeMutation';
import { useClient } from '@root/App';

interface UseJumpButton {
  onPress: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;

  onViewableItemsChanged: (params: ViewableItemsChanged<IPost>) => void;
  viewabilityConfigCallbackPairs: MutableRefObject<Array<IConfigPair<IPost>>>;

  fabStyle: AnimatedStyle;
  onScrollStart: () => void;
  onScrollEnd: () => void;
}

const viewabilityConfig = {};

export const useJumpButton = (
  flashListRef: RefObject<FlashList<IPost>>,
  itemsLength: number,
): UseJumpButton => {
  const client = useClient();

  const { mutate } = useLikeRepostMutation(client);

  const fabOpacity = useSharedValue(1);

  const currentIndex = useRef(0);

  const viewableItems = useRef<Array<ViewToken<IPost>> | undefined>([]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems: vi }: ViewableItemsChanged<IPost>) => {
      viewableItems.current = vi;
    },
    [],
  );

  const viewabilityConfigCallbackPairs = useRef<Array<IConfigPair<IPost>>>([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  // Change the opacity of the fab button on scroll
  const onScrollStart = useCallback(() => {
    fabOpacity.value = withTiming(0.5, { duration: 150 });
  }, [fabOpacity]);

  const onScrollEnd = useCallback(() => {
    fabOpacity.value = withTiming(1, { duration: 100 });
  }, [fabOpacity]);

  const onPress = useCallback(() => {
    // Play a haptic
    playHaptic();

    // Do nothing if there are no items
    // Length should be two or more since we want to scroll to the next item
    if (viewableItems.current == null || viewableItems.current?.length < 1) {
      return;
    }

    // Get the index of the next item. We want the index because the value of the item might change
    // (i.e. user likes the post). If that index doesn't exist, do nothing.
    const highestIndex = itemsLength - 1;
    const nextPossibleIndex = (viewableItems.current[0].index ?? 0) + 1;

    // We might need to add an index to this.
    const nextIndex =
      currentIndex.current === nextPossibleIndex
        ? nextPossibleIndex + 1
        : nextPossibleIndex;

    // If the index doesn't exist, do nothing
    if (nextIndex > highestIndex) return;

    // Jump to the next post in the viewable items
    flashListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });

    // Store the index
    currentIndex.current = nextIndex;
  }, [flashListRef, itemsLength]);

  const onLongPress = useCallback(() => {
    playHaptic();

    const lastIndex = currentIndex.current - 1;

    // If the index is non-existent, do nothing.
    if (lastIndex < 0) {
      return;
    }

    flashListRef.current?.scrollToIndex({
      index: currentIndex.current - 1,
      animated: true,
    });

    currentIndex.current = lastIndex;
  }, [flashListRef]);

  const onDoubleTap = useCallback(() => {
    playHaptic();

    // We can't always rely on it being the *top most* item, so we need to find the item
    // by the view index
    const item = viewableItems.current?.find(
      (item) => item.index === currentIndex.current,
    );

    if (item?.item == null) return;

    mutate({
      type: 'like',
      uri: item.item.uri,
      cid: item.item.cid,
      like: item.item.like,
    });
  }, [mutate]);

  const fabStyle = useAnimatedStyle(() => ({
    opacity: fabOpacity.value,
  }));

  return {
    onPress,
    onLongPress,
    onDoubleTap,

    onViewableItemsChanged,
    viewabilityConfigCallbackPairs,

    fabStyle,
    onScrollStart,
    onScrollEnd,
  };
};
