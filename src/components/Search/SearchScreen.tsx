import React, { useCallback, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { ScrollView, Text, XStack } from 'tamagui';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useSuggestionsQuery } from '@src/api/queries/bsky/useSuggestionsQuery';
import { IGenerator, IPerson } from '@src/types/data';
import PersonCardHorizontal from '@src/components/Common/PersonCard/PersonCardHorizontal';
import { useFeedsQuery } from '@src/api/queries/bsky/useFeedsQuery';
import FeedListItemHorizontal from '@src/components/Lists/components/FeedListItemHorizontal';
import RefreshControl from '@src/components/Common/Loading/RefreshControl';
import { useUserRefresh } from '@src/hooks/useUserRefresh';
import { useClient } from '@root/App';

const personRenderItem = ({
  item,
}: ListRenderItemInfo<IPerson>): React.JSX.Element | null => {
  return <PersonCardHorizontal person={item} />;
};

const personKeyExtractor = (item: IPerson): string => item.id;

const feedRenderItem = ({
  item,
}: ListRenderItemInfo<IGenerator>): React.JSX.Element | null => {
  return <FeedListItemHorizontal generator={item} />;
};

const feedKeyExtractor = (item: IGenerator): string => item.uri;

export default function SearchScreen({
  navigation,
}: NativeStackScreenProps<MainStackParamList>): React.JSX.Element {
  const client = useClient();

  const { data: personSuggestions, refetch: refetchPersonSuggestions } =
    useSuggestionsQuery({ client, queryKey: 'search', limit: 50 });
  const { data: feedSuggestions, refetch: refetchFeedSuggestions } =
    useFeedsQuery({ client, popular: true });

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        hideNavigationBar: false,
        hideWhenScrolling: false,
        // onBlur,
        // onFocus,
        // onSearchButtonPress,
        // onChangeText: (e) => onTermChange(e.nativeEvent.text),
        autoCapitalize: 'none',
        inputType: 'email',
      },
    });
    // }, [navigation, onSearchButtonPress, onTermChange, onFocus, onBlur]);
  }, [navigation]);

  const refreshAll = useCallback(async () => {
    return await Promise.all([
      refetchPersonSuggestions(),
      refetchFeedSuggestions(),
    ]);
  }, [refetchPersonSuggestions, refetchFeedSuggestions]);

  const { onUserRefresh, isRefreshing } = useUserRefresh(refreshAll);

  return (
    <ScrollView
      flex={1}
      space="$2"
      paddingVertical="$4"
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onUserRefresh} />
      }
    >
      <Text fontSize="$5" fontWeight="bold">
        Suggested Follows
      </Text>
      <XStack height={180}>
        <FlashList<IPerson>
          contentInsetAdjustmentBehavior="automatic"
          renderItem={personRenderItem}
          data={personSuggestions}
          keyExtractor={personKeyExtractor}
          estimatedItemSize={150}
          horizontal
        />
      </XStack>
      <Text fontSize="$5" fontWeight="bold">
        Popular Feeds
      </Text>
      <XStack height={180}>
        <FlashList<IGenerator>
          contentInsetAdjustmentBehavior="automatic"
          renderItem={feedRenderItem}
          data={feedSuggestions}
          keyExtractor={feedKeyExtractor}
          estimatedItemSize={150}
          horizontal
        />
      </XStack>
    </ScrollView>
  );
}
