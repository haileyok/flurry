import React from 'react';
import { YStack } from 'tamagui';
import { useFeedsQuery } from '@src/api/queries/bsky/useFeedsQuery';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { IGenerator } from '@src/types/data';
import FeedListLetterLabel from '@src/components/Lists/components/FeedListLetterLabel';
import FeedListItem from '@src/components/Lists/components/FeedListItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import RefreshControl from '@src/components/Common/Loading/RefreshControl';
import { useFeedsList } from '@src/components/Lists/hooks/useFeedsList';
import { useUserRefresh } from '@src/hooks/useUserRefresh';
import { useClient } from '@root/App';

const renderItem = ({
  item,
}: ListRenderItemInfo<IGenerator | string>): React.JSX.Element => {
  if (typeof item === 'string') {
    return <FeedListLetterLabel letter={item} />;
  }

  return <FeedListItem generator={item} showContextButton />;
};

const keyExtractor = (item: string | IGenerator, index: number): string => {
  if (typeof item === 'string') {
    return index.toString();
  }

  return item.uri + index.toString();
};

export default function FeedsListScreen({
  navigation,
}: NativeStackScreenProps<MainStackParamList>): React.JSX.Element {
  const client = useClient();

  // Fetch the saved feeds
  const { data, refetch } = useFeedsQuery({ client });
  const { onUserRefresh, isRefreshing } = useUserRefresh(refetch);

  // Add labels and headers to the saved feeds
  const savedItems = useFeedsList({
    feeds: data,
    alphabetize: true,
    showPinned: true,
  });

  return (
    <YStack backgroundColor="$bg" flex={1}>
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={savedItems}
        estimatedItemSize={40}
        refreshControl={
          <RefreshControl onRefresh={onUserRefresh} refreshing={isRefreshing} />
        }
        nestedScrollEnabled={true}
      />
    </YStack>
  );
}
