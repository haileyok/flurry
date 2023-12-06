import React, { useMemo } from 'react';
import { Facet, RichText } from '@atproto/api';
import { Text, useTheme } from 'tamagui';
import { useNav } from '@src/hooks/useNav';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import { openLink } from '@src/lib';

export const useRichTextElements = (
  text: string | undefined,
  facets: Facet[] | undefined,
): React.JSX.Element[] => {
  const navigation = useNav<MainStackParamList>();
  const theme = useTheme();

  return useMemo(() => {
    if (text == null) return [];

    let richText: RichText;

    try {
      richText = new RichText(
        { text, facets },
        {
          cleanNewlines: true,
        },
      );
    } catch (e: any) {
      // Sometimes we are getting an error here...let's try to catch it and see what happens
      return [];
    }

    let i = 0;

    return Array.from(richText.segments()).map((segment) => {
      const link = segment.link;
      const mention = segment.mention;

      const onPress =
        mention != null || link != null
          ? () => {
              if (mention) {
                navigation.push('Profile', {
                  personOrUri: mention.did,
                });
              } else {
                openLink(link?.uri, theme.bg.val as string);
              }
            }
          : undefined;

      return (
        <Text
          key={i++}
          color={mention != null || link != null ? '$accent' : undefined}
          onPress={onPress}
        >
          {segment.text}
        </Text>
      );
    });
  }, [text, facets, navigation, theme.bg.val]);
};
