import React from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import { useTheme, YStack } from 'tamagui';

interface IProps {
  visible: boolean;
}

/**
 * A basic spinner overlay for loading states.
 * @param {boolean} visible
 * @returns {React.JSX.Element | null}
 * @constructor
 */
export default function LoadingOverlay({
  visible,
}: IProps): React.JSX.Element | null {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent>
      <YStack
        flex={1}
        backgroundColor="rgba(0,0,0,0.5)"
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator color={theme.accent.val as string} size="large" />
      </YStack>
    </Modal>
  );
}
