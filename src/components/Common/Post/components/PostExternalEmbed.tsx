import React, { useCallback } from 'react';
import { IExternal } from '@src/types/data';
import { Text, useTheme, YStack } from 'tamagui';
import { getBaseUri, openLink } from '@src/lib';
import { Image } from 'expo-image';
import { useLayoutWidth } from '@src/hooks';

interface IProps {
  external: IExternal;
}

export default function PostExternalEmbed({
  external,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  const { width, onLayout } = useLayoutWidth();

  const onPress = useCallback(() => {
    void openLink(external.uri, theme.bg.val);
  }, [external.uri, theme.bg.val]);

  return (
    <YStack
      borderColor="$border"
      borderWidth={1}
      borderRadius="$2"
      marginVertical="$2"
      onPress={onPress}
      onLayout={onLayout}
    >
      <YStack space="$1" paddingVertical="$2" paddingHorizontal="$3">
        <Text fontSize="$2" color="$secondary">
          {getBaseUri(external.uri)}
        </Text>
        <Text fontSize="$3" fontWeight="bold" flex={1} numberOfLines={2}>
          {external.title}
        </Text>
        {external.description && (
          <Text fontSize="$3" flex={1} numberOfLines={3}>
            {external.description}
          </Text>
        )}
      </YStack>

      {external.thumb != null && (
        <Image
          source={external.thumb}
          style={{
            width,
            height: 140,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
          recyclingKey={external.thumb}
        />
      )}
    </YStack>
  );
}
