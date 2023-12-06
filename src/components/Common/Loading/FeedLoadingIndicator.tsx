import React from 'react';
import { Text, useTheme, YStack } from 'tamagui';
import { ActivityIndicator } from 'react-native';

interface IProps {
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  retry: () => unknown;
}

/**
 * Indicator used in lists.
 * @param isLoading - Whether the feed is currently loading
 * @param isEmpty - Whether the feed is empty (usually data.length == null || data.length === 0)
 * @param isError - Whether there was an error during the loading of the feed/list
 * @param retry - An option function to retry the load. Will present a button to retry if provided
 * @constructor
 */
export default function FeedLoadingIndicator({
  isLoading,
  isEmpty,
  isError,
  retry,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <YStack marginVertical="$4" alignItems="center">
      {(isLoading && (
        <YStack space="$2" alignItems="center">
          <ActivityIndicator size="small" color={theme.accent.val as string} />
        </YStack>
      )) ||
        (isError && (
          <YStack space="$2" alignItems="center">
            <Text fontSize="$1" color="$secondary">
              An error has occurred...
            </Text>
          </YStack>
        )) ||
        (isEmpty && (
          <YStack space="$2" alignItems="center">
            <Text fontSize="$1" color="$secondary">
              Nothing found...
            </Text>
          </YStack>
        ))}
    </YStack>
  );
}
