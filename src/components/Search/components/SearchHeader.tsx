import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';
import SearchBar, {
  ISearchBarProps,
} from '@src/components/Search/components/SearchBar';
import { useTheme } from '@react-navigation/native';

export default function SearchHeader(
  props: ISearchBarProps,
): React.JSX.Element {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <YStack
      backgroundColor="bg"
      paddingTop={top + 10}
      borderBottomWidth={1}
      borderBottomColor={1}
    >
      <Text
        alignSelf="center"
        color={theme.colors.text}
        fontSize={17}
        fontWeight="bold"
      >
        Search
      </Text>
      <SearchBar placeholder="Search" {...props} />
    </YStack>
  );
}
