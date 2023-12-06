import React, { useCallback, useEffect, useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { IEmbed, ILabels } from '@src/types/data';
import PostImages from '@src/components/Common/Post/components/PostImages';
import EmbeddedPost from '@src/components/Common/EmbeddedPost/EmbeddedPost';
import PostGeneratorEmbed from '@src/components/Common/Post/components/PostGeneratorEmbed';
import PostListEmbed from '@src/components/Common/Post/components/PostListEmbed';
import { AlertCircle } from '@tamagui/lucide-icons';
import { useRichTextElements } from '@src/hooks/useRichTextElements';
import { Facet } from '@atproto/api';
import PostExternalEmbed from '@src/components/Common/Post/components/PostExternalEmbed';
import { useLayoutWidth } from '@src/hooks';

interface IPostBodyProps {
  body?: string;
  facets?: Facet[];
  lineHeight?: any;
  fontSize?: any;
}

interface IProps extends IPostBodyProps {
  embed?: IEmbed;
  showEmbeddedPosts?: boolean;
  labels: ILabels | undefined;
  isBlocked: boolean;
}

export function PostBody({
  body,
  facets,
  lineHeight,
  fontSize,
}: IPostBodyProps): React.JSX.Element | null {
  const richText = useRichTextElements(body, facets);

  if (body == null) return null;

  return (
    <Text fontSize={fontSize} flexShrink={1} lineHeight={lineHeight}>
      {richText}
    </Text>
  );
}

function PostContents({
  labels,
  body,
  facets,
  embed,
  showEmbeddedPosts = false,
  fontSize = '$3',
  lineHeight,
  isBlocked,
}: IProps): React.JSX.Element | null {
  const { width, onLayout } = useLayoutWidth();

  const [isShown, setIsShown] = useState(false);

  // Make sure we update the state here when the post changes (flashlist)
  useEffect(() => {
    if (isShown) setIsShown(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, embed]);

  const onViewTogglePress = useCallback(() => {
    setIsShown((prev) => !prev);
  }, []);

  return (
    <YStack onLayout={onLayout}>
      {labels?.isHidden === true && (
        <YStack
          backgroundColor="$fg"
          padding="$2"
          borderRadius="$4"
          marginVertical="$2"
          onPress={onViewTogglePress}
          hitSlop={3}
        >
          <XStack space="$3" alignItems="center">
            <AlertCircle size={32} />
            <YStack>
              <Text fontSize="$3" fontWeight="bold">
                {labels.warning}
              </Text>
              <Text fontSize="$2">Tap to {isShown ? 'hide' : 'show'}</Text>
            </YStack>
          </XStack>
        </YStack>
      )}

      {isBlocked && (
        <YStack
          backgroundColor="$fg"
          padding="$2"
          borderRadius="$4"
          marginVertical="$2"
          onPress={onViewTogglePress}
          hitSlop={3}
        >
          <XStack space="$3" alignItems="center">
            <AlertCircle size={32} />
            <YStack>
              <Text fontSize="$3" fontWeight="bold">
                User is Blocked
              </Text>
            </YStack>
          </XStack>
        </YStack>
      )}

      {(labels?.isHidden !== true || isShown) && !isBlocked && (
        <>
          <PostBody
            body={body}
            facets={facets}
            fontSize={fontSize}
            lineHeight={lineHeight}
          />
          {(embed?.type === 'image' ||
            (embed?.type === 'postWithMedia' && embed?.images != null)) && (
            <YStack alignItems="center" justifyContent="center">
              <PostImages images={embed.images!} layoutWidth={width} />
            </YStack>
          )}
          {(embed?.type === 'external' ||
            (embed?.type === 'postWithMedia' && embed?.external != null)) && (
            <PostExternalEmbed external={embed.external!} />
          )}
          {embed?.type === 'generator' && (
            <PostGeneratorEmbed generator={embed.generator!} />
          )}
          {embed?.type === 'list' && <PostListEmbed list={embed.list!} />}
          {(embed?.type === 'post' || embed?.type === 'postWithMedia') &&
            showEmbeddedPosts && <EmbeddedPost post={embed.post!} />}
        </>
      )}
    </YStack>
  );
}

export default React.memo(PostContents);
