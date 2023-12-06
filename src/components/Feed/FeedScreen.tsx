import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { YStack } from 'tamagui';
import FeedPostContainer from '@src/components/Common/Post/postContainers/FeedPostContainer';
import FeedLoadingIndicator from '@src/components/Common/Loading/FeedLoadingIndicator';
import RefreshControl from '@src/components/Common/Loading/RefreshControl';
import { IFeed, IPost } from '@src/types/data';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import {
  feedQueryFunction,
  useFeedQuery,
} from '@src/api/queries/bsky/useFeedQuery';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import FAB from '@src/components/Common/FAB/FAB';
import { ChevronDown, Plus } from '@tamagui/lucide-icons';
import { useJumpButton } from '@src/hooks/useJumpButton';
import Animated from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { useSettingsStore } from '@src/state/settings';
import { useScrollToTop } from '@react-navigation/native';
import { useClient } from '@root/App';

const renderItem = ({ item }: ListRenderItemInfo<IPost>): React.JSX.Element => {
  return <FeedPostContainer post={item} />;
};

const keyExtractor = (item: IPost, index: number): string =>
  item.uri + item.createdAt + index.toString();

const getItemType = (item: IPost): string => {
  return item.embed?.type ?? 'generic';
};

export default function FeedScreen({
  navigation,
  route,
}: NativeStackScreenProps<MainStackParamList, 'Feed'>): React.JSX.Element {
  const client = useClient();
  const queryClient = useQueryClient();

  const {
    mainFabEnabled,
    mainFabPosition,
    secondaryFabEnabled,
    secondaryFabPosition,
  } = useSettingsStore();

  const [isRefetching, setIsRefetching] = useState(false);
  const { uri, feedName } = route.params ?? {};

  const { isFetching, isError, data, refetch, fetchNextPage } = useFeedQuery({
    client,
    feed: uri,
  });

  const flashListRef = useRef<FlashList<IPost>>(null);

  // Use RefObject<any> since useScrollTopTop doesn't like FlashList
  useScrollToTop(flashListRef as RefObject<any>);

  const posts = useMemo(() => {
    return data?.pages.flatMap((p) => p.posts) ?? [];
  }, [data]);

  const jumpButton = useJumpButton(flashListRef, posts.length);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: feedName ?? 'Home',
    });
  }, [feedName, navigation]);

  const refetchPosts = useCallback(async () => {
    // Set refetching
    setIsRefetching(true);

    try {
      // Get the query result
      const res = await feedQueryFunction({
        client,
        queryKey: ['feed', ...(uri != null ? [uri] : [])], // Add the feed URI to the key if needed
        feed: uri,
      });

      // // Set the query data
      queryClient.setQueryData<InfiniteData<IFeed>>(['feed'], (old) => {
        return produce(old, (draft) => {
          if (draft == null) return;
          draft.pages = [res];
        });
      });
    } finally {
      setIsRefetching(false);
    }
  }, [uri]);

  const onSecondaryFabPress = useCallback(() => {
    navigation.push('NewPost');
  }, [navigation]);

  return (
    <YStack flex={1}>
      <FlashList<IPost>
        renderItem={renderItem}
        data={posts}
        keyExtractor={keyExtractor}
        estimatedItemSize={150}
        getItemType={getItemType}
        ListFooterComponent={
          <FeedLoadingIndicator
            isLoading={isFetching}
            isError={isError}
            isEmpty={posts.length < 1}
            retry={refetch}
          />
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetchPosts} />
        }
        viewabilityConfigCallbackPairs={
          jumpButton.viewabilityConfigCallbackPairs.current
        }
        onEndReachedThreshold={2}
        onEndReached={fetchNextPage}
        ref={flashListRef}
      />
      <Animated.View style={jumpButton.fabStyle}>
        <FAB
          onPress={jumpButton.onPress}
          onLongPress={jumpButton.onLongPress}
          onDoubleTap={jumpButton.onDoubleTap}
          visible={mainFabEnabled}
          Icon={ChevronDown}
          position={mainFabPosition}
        />
        <FAB
          onPress={onSecondaryFabPress}
          visible={secondaryFabEnabled}
          Icon={Plus}
          iconColor="fg"
          backgroundColor="$inverse"
          position={secondaryFabPosition}
        />
      </Animated.View>
    </YStack>
  );
}
