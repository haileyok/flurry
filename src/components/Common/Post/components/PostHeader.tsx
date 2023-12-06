import React, { useCallback } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { IPerson } from '@src/types/data';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TimeFrom from '@src/components/Common/TimeFrom/TimeFrom';

interface IProps {
  person: IPerson | undefined;
  createdAt: string | undefined;
  type: 'regular' | 'main';
}

function PostHeader({
  person,
  createdAt,
  type = 'regular',
}: IProps): React.JSX.Element | null {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const onPress = useCallback(() => {
    navigation.push('Profile', {
      personOrUri: person!,
    });
  }, [navigation, person]);

  if (person == null) return null;

  if (type === 'main') {
    return (
      <YStack flex={1} flexGrow={1} onPress={onPress} hitSlop={3}>
        <Text flex={1} numberOfLines={1} fontSize="$3" fontWeight="bold">
          {person.displayName ?? person.handle}
        </Text>
        <Text fontSize="$2" color="$secondary" flex={1} numberOfLines={1}>
          @{person.handle}
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} hitSlop={3}>
      <XStack alignItems="center" marginBottom="$1">
        <Text flex={1} numberOfLines={1} space="$2">
          <Text fontSize="$3" fontWeight="bold" onPress={onPress} hitSlop={10}>
            {person.displayName ?? person.handle}
          </Text>
          <Text fontSize="$2" color="$secondary" onPress={onPress} hitSlop={5}>
            @{person.handle}
          </Text>
        </Text>
        <TimeFrom timestamp={createdAt} />
      </XStack>
    </YStack>
  );
}

export default React.memo(PostHeader);
