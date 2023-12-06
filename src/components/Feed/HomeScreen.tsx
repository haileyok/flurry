import React from 'react';
import FeedScreen from '@src/components/Feed/FeedScreen';
import { useInitializeAccount } from '@src/components/Feed/hooks/useInitializeAccount';
import LoadingOverlay from '@src/components/Common/Loading/LoadingOverlay';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';

export default function HomeScreen(
  props: NativeStackScreenProps<MainStackParamList, 'Feed'>,
): React.JSX.Element {
  const initialize = useInitializeAccount();

  if (!initialize.isReady) {
    return <LoadingOverlay visible={true} />;
  }

  return <FeedScreen {...props} />;
}
