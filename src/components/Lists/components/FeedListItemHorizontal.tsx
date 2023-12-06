import React from 'react';
import { IGenerator } from '@src/types/data';
import { Text, XStack, YStack } from 'tamagui';
import MainButton from '@src/components/Common/Button/MainButton';
import { Image } from 'expo-image';
import { useRichTextElements } from '@src/hooks';

interface IProps {
  generator: IGenerator;
}

function FeedListItemHorizontal({ generator }: IProps): React.JSX.Element {
  const richTextElements = useRichTextElements(
    generator.description,
    generator.facets,
  );

  return (
    <YStack
      width={230}
      margin="$1.5"
      borderRadius="$2"
      padding="$2"
      flex={1}
      space="$2"
    >
      <XStack space="$3" flex={1}>
        <Image
          source={generator.avatar}
          style={{ height: 30, width: 30, borderRadius: 5 }}
          recyclingKey={generator.avatar}
        />
        <YStack space="$1" flex={1} flexShrink={1}>
          <Text
            fontSize="$3"
            fontWeight="bold"
            numberOfLines={1}
            flex={1}
            marginBottom={-10}
          >
            {generator.name}
          </Text>
          <Text fontSize="$2" numberOfLines={1} color="$secondary" flex={1}>
            by {generator.creator.displayName ?? `@${generator.creator.handle}`}
          </Text>
        </YStack>
      </XStack>
      <XStack space="$2" flex={1}>
        <MainButton label="Save Feed" onPress={() => {}} flex={1} />
      </XStack>
      <Text numberOfLines={4} flex={1}>
        {richTextElements}
      </Text>
    </YStack>
  );
}

export default React.memo(FeedListItemHorizontal);
