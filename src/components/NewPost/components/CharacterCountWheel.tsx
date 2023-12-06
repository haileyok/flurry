import React from 'react';
import { Text, useTheme, XStack } from 'tamagui';
import { Canvas, Paint, Path, Skia } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';

interface IProps {
  characterCount: number;
}

const circlePath = Skia.Path.Make();
circlePath.moveTo(16, 16);
circlePath.addCircle(16, 16, 14);

export default function CharacterCountWheel({
  characterCount,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <XStack space="$2" alignItems="center" marginLeft="auto" marginRight="$3">
      <Text fontSize="$3" color="$secondary">
        {300 - characterCount}
      </Text>
      <Canvas style={styles.canvas}>
        <Path path={circlePath} color="transparent">
          <Paint
            color={theme.border.val as string}
            style="stroke"
            strokeCap="butt"
            strokeWidth={4}
          />
        </Path>
        <Path
          path={circlePath}
          color="transparent"
          start={0}
          end={characterCount / 300}
        >
          <Paint
            style="stroke"
            strokeCap="butt"
            strokeWidth={4}
            color={
              characterCount <= 300
                ? (theme.accent.val as string)
                : (theme.danger.val as string)
            }
          />
        </Path>
      </Canvas>
    </XStack>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: 32,
    height: 32,
  },
});
