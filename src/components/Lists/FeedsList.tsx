import React from 'react';
import { useFeedsQuery } from '@src/api/queries/bsky/useFeedsQuery';
import { IGenerator } from '@src/types/data';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import FeedListLetterLabel from '@src/components/Lists/components/FeedListLetterLabel';
import FeedListItem from '@src/components/Lists/components/FeedListItem';
import { useFeedsList } from '@src/components/Lists/hooks/useFeedsList';
import RefreshControl from '@src/components/Common/Loading/RefreshControl';
import { useClient } from '@root/App';

interface IProps {
  alphabetize?: boolean;
  addLabels?: boolean;
  showPinned?: boolean;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<string | IGenerator>): React.JSX.Element => {
  if (typeof item === 'string') {
    return <FeedListLetterLabel letter={item} />;
  }

  return <FeedListItem generator={item} />;
};

const keyExtractor = (item: string | IGenerator, index: number): string => {
  if (typeof item === 'string') {
    return index.toString();
  }

  return item.uri + index.toString();
};

export default function FeedsList({
  alphabetize = false,
  addLabels = false,
  showPinned = false,
}: IProps): React.JSX.Element {
  const client = useClient();
  const { data: feeds, isRefetching, refetch } = useFeedsQuery({ client });

  const items = useFeedsList({
    feeds,
    alphabetize,
    addLabels,
    showPinned,
  });

  return (
    <FlashList
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      data={items}
      estimatedItemSize={40}
      refreshControl={
        <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
      }
    />
  );
}
