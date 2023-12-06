import React, { useEffect } from 'react';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { usePersonListQuery } from '@src/api/queries/bsky/usePersonListQuery';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { YStack } from 'tamagui';
import { IPerson } from '@src/types/data';
import FeedLoadingIndicator from '@src/components/Common/Loading/FeedLoadingIndicator';
import PersonCard from '@src/components/Common/PersonCard/PersonCard';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useClient } from '@root/App';

const renderItem = ({
  item,
}: ListRenderItemInfo<IPerson>): React.JSX.Element => {
  return <PersonCard person={item} type="full" />;
};

const keyExtractor = (item: IPerson): string => item.id;

export default function PersonListScreen({
  navigation,
  route,
}: NativeStackScreenProps<
  MainStackParamList,
  'PersonList'
>): React.JSX.Element {
  const client = useClient();
  const { type, uri } = route.params;

  const { isError, isFetching, data, refetch, fetchNextPage } =
    usePersonListQuery({ client, type, uri });

  const persons = data?.pages.flatMap((p) => p.persons ?? [], [data]);

  useEffect(() => {
    const getTitle = (): string => {
      switch (type) {
        case 'like':
          return 'Liked By';
        case 'repost':
          return 'Reposted By';
        case 'followers':
          return 'Followers';
        case 'following':
          return 'Following';
      }
    };

    navigation.setOptions({
      headerTitle: getTitle(),
    });
  }, [navigation, type]);

  return (
    <YStack flex={1}>
      <FlashList<IPerson>
        data={persons}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={150}
        onEndReachedThreshold={2}
        ListFooterComponent={
          <FeedLoadingIndicator
            isLoading={isFetching}
            isError={isError}
            isEmpty={persons?.length === 0}
            retry={refetch}
          />
        }
        onEndReached={fetchNextPage}
      />
    </YStack>
  );
}
