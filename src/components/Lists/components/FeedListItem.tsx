import React, { useCallback } from 'react';
import { IGenerator } from '@src/types/data';
import { Text, XStack } from 'tamagui';
import { Image } from 'expo-image';
import { ChevronRight } from '@tamagui/lucide-icons';
import { useNavigationRef } from '@root/App';
import { setDrawerOpen } from '@src/state/app';
import FeedListItemContextButton from '@src/components/Lists/components/FeedListItemContextButton';

interface IProps {
  generator: IGenerator;
  showContextButton?: boolean;
}

export default function FeedListItem({
  generator,
  showContextButton = false,
}: IProps): React.JSX.Element {
  const navRef = useNavigationRef();

  const onPress = useCallback(() => {
    setDrawerOpen('left', false);
    // @ts-expect-error TODO Figure out how (if?) to type this
    navRef?.navigate('Feed', { uri: generator.uri, feedName: generator.name });
  }, [navRef, generator]);

  return (
    <XStack
      alignItems="center"
      paddingVertical="$2"
      paddingHorizontal="$3"
      borderBottomColor="$border"
      borderBottomWidth={1}
      space="$2"
      onPress={onPress}
      hitSlop={3}
    >
      <Image
        source={generator.avatar}
        style={{ height: 30, width: 30, borderRadius: 5 }}
        recyclingKey={generator.avatar}
      />
      <Text fontSize="$3">{generator.name}</Text>
      <XStack marginLeft="auto" space="$3.5">
        {showContextButton && (
          <FeedListItemContextButton generator={generator} />
        )}
        <ChevronRight />
      </XStack>
    </XStack>
  );
}
