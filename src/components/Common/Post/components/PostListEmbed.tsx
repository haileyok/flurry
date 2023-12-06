import React, { useCallback } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { IList } from '@src/types/data';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

interface IProps {
  list: IList;
}

export default function PostListEmbed({ list }: IProps): React.JSX.Element {
  const onPress = useCallback(() => {
    // TODO Navigate
  }, []);

  return (
    <YStack
      borderColor="$border"
      borderWidth={1}
      borderRadius="$2"
      paddingVertical="$2"
      paddingHorizontal="$3"
      marginVertical="$2"
      onPress={onPress}
      space="$2"
    >
      <XStack space="$2.5" alignItems="center" marginBottom="$1.5">
        <Image source={list.avatar} style={styles.avatar} />
        <YStack space="$1">
          <Text fontSize="$3" fontWeight="bold">
            {list.name}
          </Text>
          <Text fontSize="$2" color="$secondary">
            by @{list.creator?.handle}
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 5,
  },
});
