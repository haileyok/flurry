import React, { useCallback, useMemo, useState } from 'react';
import FeedLoadingIndicator from '@src/components/Common/Loading/FeedLoadingIndicator';
import RefreshControl from '@src/components/Common/Loading/RefreshControl';
import { IFeed, IPerson, IPost } from '@src/types/data';
import { PersonPostsFilterType } from '@src/types/bsky/PersonPostsFilterType';
import { Tabs } from 'react-native-collapsible-tab-view';
import { YStack } from 'tamagui';
import {
  personPostsQueryFunction,
  usePersonPostsQuery,
} from '@src/api/queries/bsky/usePersonPostsQuery';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { ListRenderItemInfo } from '@shopify/flash-list';
import FeedPostContainer from '@src/components/Common/Post/postContainers/FeedPostContainer';
import { useClient } from '@root/App';

interface IProps {
  personOrUri: string | IPerson;
  type: PersonPostsFilterType;
}

const renderItem = ({ item }: ListRenderItemInfo<IPost>): React.JSX.Element => {
  return <FeedPostContainer post={item} />;
};

const keyExtractor = (item: IPost, index: number): string =>
  item.uri + item.createdAt + index.toString();

export default function ProfilePostsTab({
  personOrUri,
  type,
}: IProps): React.JSX.Element {
  const client = useClient();
  const queryClient = useQueryClient();

  const [isRefetching, setIsRefetching] = useState(false);
  const { isFetching, isError, refetch, data, fetchNextPage } =
    usePersonPostsQuery({
      client,
      uri: (personOrUri as IPerson).id ?? personOrUri,
      type,
    });

  const posts = useMemo(() => {
    return data?.pages.flatMap((p) => p.posts) ?? [];
  }, [data]);

  const refetchPosts = useCallback(async () => {
    setIsRefetching(true);

    await refetch();

    const res = await personPostsQueryFunction({
      client,
      uri: (personOrUri as IPerson).id ?? personOrUri,
      type,
    });

    queryClient.setQueryData<InfiniteData<IFeed>>(
      ['feed', (personOrUri as IPerson).id ?? personOrUri, type],
      (old) => {
        return produce(old, (draft) => {
          if (draft == null) return;

          draft.pages = [res];
        });
      },
    );

    setIsRefetching(false);
  }, [personOrUri, refetch, type]);

  return (
    <YStack height="100%">
      <Tabs.FlashList
        renderItem={renderItem}
        data={posts}
        keyExtractor={keyExtractor}
        estimatedItemSize={200}
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
        onEndReached={fetchNextPage}
        onEndReachedThreshold={2}
      />
    </YStack>
  );
}
