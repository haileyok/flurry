import React, { useCallback } from 'react';
import { IThreadPost } from '@src/types/data';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import NotFoundPost from '@src/components/Common/Post/postTypes/NotFoundPost';
import { useTheme, XStack, YStack } from 'tamagui';
import PostContents from '@src/components/Common/Post/components/PostContents';
import PostMetrics from '@src/components/Common/Post/components/PostMetrics';
import CompactPostHeader from '@src/components/Common/EmbeddedPost/components/CompactPostHeader';
import { Canvas, Path, Skia, SkPath, SkSize } from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface IProps {
  post: IThreadPost;
}

const createCurvePath = (depth: number): SkPath => {
  const curvePath = Skia.Path.Make();
  const startX = (depth - 1) * 20 + 5;

  curvePath.moveTo(startX, 0);
  curvePath.lineTo(startX, 10);
  curvePath.arcToTangent(startX, 20, startX + 10, 20, 10);
  curvePath.moveTo(startX + 10, 20);
  curvePath.lineTo(startX + 20, 20);
  curvePath.close();

  return curvePath;
};

const createStraightPath = (depths: number[] | undefined): SkPath => {
  const straightPath = Skia.Path.Make();

  if (depths == null) return straightPath;

  for (const depth of depths) {
    const startX = depth * 20 + 5;

    straightPath.moveTo(startX, 0);
    straightPath.lineTo(startX, 300);
  }

  straightPath.close();

  return straightPath;
};

function ThreadPostReply({ post }: IProps): React.JSX.Element {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const size = useSharedValue<SkSize>({ width: 0, height: 0 });

  // Navigate on press
  const onPress = useCallback(() => {
    navigation.push('Post', {
      post,
      uri: post.uri,
    });
  }, [navigation, post]);

  const curvePath = createCurvePath(post.depth);
  const straightPath = createStraightPath(post.hasMoreAtDepths);

  if (post.isNotFound) {
    return <NotFoundPost />;
  }

  return (
    <YStack
      paddingHorizontal="$2.5"
      backgroundColor="$bg"
      onPress={onPress}
      borderWidth={0}
    >
      <Canvas style={styles.canvas} onSize={size}>
        {post.hasParent && (
          <Path
            path={curvePath}
            style="stroke"
            strokeWidth={2}
            color={theme.border.val as string}
          />
        )}
        {post.hasMoreAtDepths != null && (
          <Path
            path={straightPath}
            style="stroke"
            strokeWidth={2}
            color={theme.border.val as string}
          />
        )}
      </Canvas>
      <XStack marginLeft={(post.depth - 1) * 20 + 5}>
        <YStack flex={1} paddingVertical="$2">
          <CompactPostHeader person={post.creator} createdAt={post.createdAt} />

          <PostContents
            labels={post.labels}
            body={post.body}
            facets={post.facets}
            embed={post.embed}
            showEmbeddedPosts
            isBlocked={post.isBlocked}
          />
          <PostMetrics post={post} />
        </YStack>
      </XStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    height: '101%',
    width: 200,
  },
});

export default React.memo(ThreadPostReply);
