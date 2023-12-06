import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Text, YStack } from 'tamagui';
import MainButton from '@src/components/Common/Button/MainButton';

interface IProps {
  error?: string;
  retry: () => unknown;
  children: React.ReactNode;
}

export default function QueryErrorWrapper({
  error,
  retry,
  children,
}: IProps): React.JSX.Element {
  return (
    <ErrorBoundary
      fallbackRender={() => <ErrorFallback error={error} retry={retry} />}
    >
      {children}
    </ErrorBoundary>
  );
}

function ErrorFallback({
  error,
  retry,
}: Omit<IProps, 'children'>): React.JSX.Element {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Text fontSize="$5">Error</Text>
      <Text>{error}</Text>
      <MainButton onPress={retry} label="Retry" highlight />
    </YStack>
  );
}
