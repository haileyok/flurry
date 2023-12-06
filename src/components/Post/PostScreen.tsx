import React, { useCallback, useEffect, useRef } from 'react';
import { YStack } from 'tamagui';
import FeedLoadingIndicator from '@src/components/Common/Loading/FeedLoadingIndicator';
import RefreshControl from '@src/components/Common/Loading/RefreshControl';
import { IPost, IThreadPost } from '@src/types/data';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import MainPost from '@src/components/Common/Post/postTypes/MainPost';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { usePostQuery } from '@src/api/queries/bsky/usePostQuery';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ThreadPostReply from '@src/components/Common/Post/postTypes/ThreadPostReply';
import { useSettingsStore } from '@src/state/settings';
import FeedPost from '@src/components/Common/Post/postTypes/FeedPost';
import { useClient } from '@root/App';

// Get half of the screen height
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const keyExtractor = (item: IPost, index: number): string => item.cid;

export default function PostScreen({
  route,
}: NativeStackScreenProps<MainStackParamList, 'Post'>): React.JSX.Element {
  const client = useClient();

  const { post, uri } = route.params;
  const { threadedMode } = useSettingsStore();

  const { isFetching, isFetchedAfterMount, isError, refetch, data } =
    usePostQuery({ client, postOrUri: post ?? uri! }); // TODO fix this
  // TODO why did I say fix this? ^

  // Store the initial index when we render the screen
  const didInitialScroll = useRef(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => {
      if (
        !didInitialScroll.current &&
        data?.mainPostIndex != null &&
        data?.mainPostIndex !== 0
      ) {
        flatListRef.current?.scrollToIndex({
          index: data?.mainPostIndex ?? 0,
          animated: true,
        });

        didInitialScroll.current = true;
      }
    }, 100);
  }, [data]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<IThreadPost>): React.JSX.Element => {
      if (index === data?.mainPostIndex) {
        return <MainPost post={item as IPost} />;
      } else if (index <= data!.mainPostIndex) {
        return (
          <FeedPost
            post={item as IPost}
            drawBottomLine={item.hasReply}
            drawTopLine={item.hasParent}
          />
        );
      } else {
        if (threadedMode) return <ThreadPostReply post={item} />;

        return (
          <FeedPost
            post={item}
            showEmbeddedPosts
            avatarSize={42}
            drawTopLine={item.hasParent}
            drawBottomLine={item.hasReply}
            borderBottom={!item.hasReply}
          />
        );
      }
    },
    [data, threadedMode],
  );

  const getItemType = useCallback(
    (item: IThreadPost, index: number): string => {
      if (index === data!.mainPostIndex) {
        return 'main';
      } else if (index < data!.mainPostIndex) {
        return 'parent';
      }

      return 'reply';
    },
    [data],
  );

  return (
    <YStack flex={1}>
      <FlashList<IThreadPost>
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={data?.posts}
        estimatedItemSize={200}
        getItemType={getItemType}
        ListFooterComponent={
          <FeedLoadingIndicator
            isLoading={isFetching && !isFetchedAfterMount}
            isError={isError}
            isEmpty={data == null || data.posts.length === 0}
            retry={refetch}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching && isFetchedAfterMount}
            onRefresh={refetch}
          />
        }
        contentContainerStyle={styles.container}
        // @ts-expect-error Valid
        ref={flatListRef}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SCREEN_HEIGHT / 3,
  },
});
