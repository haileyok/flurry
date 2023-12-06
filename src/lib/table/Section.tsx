import React from 'react';
import { Text, YStack } from 'tamagui';

interface IProps {
  header?: string;
  footer?: string;
  children: React.ReactNode;
}

export default function Section({
  header,
  footer,
  children,
}: IProps): React.JSX.Element {
  return (
    <YStack>
      {header != null && (
        <Text
          color="$secondary"
          paddingHorizontal="$3"
          paddingVertical="$2"
          fontSize={12}
        >
          {header.toUpperCase()}
        </Text>
      )}
      {children}
      {footer != null && (
        <Text
          color="$secondary"
          paddingHorizontal="$3"
          paddingVertical="$2"
          fontSize={12}
        >
          {footer}
        </Text>
      )}
    </YStack>
  );
}
