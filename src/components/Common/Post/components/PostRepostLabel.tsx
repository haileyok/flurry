import React, { useCallback } from 'react';
import { IPerson } from '@src/types/data';
import { Text, useTheme, XStack } from 'tamagui';
import { useNav } from '@src/hooks/useNav';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import Repost from '@src/components/Common/BlahBlahBlah/Repost';

interface IProps {
  person?: IPerson;
}

export default function PostRepostLabel({
  person,
}: IProps): React.JSX.Element | null {
  const theme = useTheme();
  const navigation = useNav<MainStackParamList>();

  const onPress = useCallback(() => {
    navigation.push('Profile', { personOrUri: person! });
  }, [navigation, person]);

  if (person == null) return null;

  return (
    <XStack marginLeft="8%" paddingTop="$2" alignItems="center" space="$1.5">
      <Repost size={16} color={theme.secondary.val} />
      <Text
        fontSize="$3"
        fontWeight="bold"
        color="$secondary"
        onPress={onPress}
        flex={1}
        numberOfLines={1}
      >
        Reposted by {person.displayName ?? person.handle}
      </Text>
    </XStack>
  );
}
