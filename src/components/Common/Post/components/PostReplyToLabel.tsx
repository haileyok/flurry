import React, { useCallback } from 'react';
import { IPerson } from '@src/types/data';
import { Text, XStack } from 'tamagui';
import { MessageCircle } from '@tamagui/lucide-icons';
import { useNav } from '@src/hooks/useNav';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';

interface IProps {
  person: IPerson | undefined;
}

export default function PostReplyToLabel({
  person,
}: IProps): React.JSX.Element | null {
  const navigation = useNav<MainStackParamList>();

  const onPress = useCallback(() => {
    navigation.push('Profile', { personOrUri: person! });
  }, [navigation, person]);

  if (person == null) return null;

  return (
    <XStack marginLeft="8%" paddingTop="$2" alignItems="center" space="$1.5">
      <MessageCircle size={14} color="$secondary" />
      <Text
        fontSize="$3"
        fontWeight="bold"
        color="$secondary"
        onPress={onPress}
        flex={1}
        numberOfLines={1}
      >
        Replying to {person.displayName ?? person.handle}
      </Text>
    </XStack>
  );
}
