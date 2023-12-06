import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { UserCircle2 } from '@tamagui/lucide-icons';
import { Image } from 'expo-image';
import { YStack } from 'tamagui';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { useNav } from '@src/hooks/useNav';
import { IPerson } from '@src/types/data';

interface IProps {
  person?: IPerson;
  avatar?: string;
  pressAction: 'profile' | 'view' | 'none';
  size?: number;
  hasLine?: boolean;
}

function Avatar({
  person,
  avatar,
  pressAction = 'profile',
  size = 48,
}: IProps): React.JSX.Element {
  const navigation = useNav<MainStackParamList>();

  const onPress = useCallback(() => {
    if (pressAction === 'none' || person == null) return;

    navigation.push('Profile', { personOrUri: person });
  }, [navigation, person, pressAction]);

  return (
    <Pressable onPress={onPress}>
      <YStack alignItems="center" flexShrink={1}>
        {avatar == null && person?.avatar == null ? (
          <UserCircle2 size={size} />
        ) : (
          <Image
            source={avatar ?? person!.avatar}
            style={[{ width: size, height: size }, styles.image]}
            recyclingKey={avatar ?? person!.avatar}
            cachePolicy="memory-disk"
            blurRadius={person?.isBlocked ? 90 : 0}
          />
        )}
      </YStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 100,
  },
});

export default React.memo(Avatar);
