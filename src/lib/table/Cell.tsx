import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { Pressable, Switch } from 'react-native';
import { ChevronRight } from '@tamagui/lucide-icons';

interface IProps {
  accessoryRight?: React.ReactNode;
  accessoryLeft?: React.ReactNode;
  chevron?: boolean;
  onPress?: () => unknown | Promise<unknown>;
  label?: string;
  rightLabel?: string;
  switchValue?: boolean;
  onSwitchValueChange?: (value: boolean) => void | Promise<void>;
  labelStyle?: 'normal' | 'large';
  subtitle?: string;
}

export default function Cell({
  accessoryRight,
  accessoryLeft,
  chevron,
  onPress,
  label,
  rightLabel,
  switchValue,
  onSwitchValueChange,
  labelStyle = 'normal',
  subtitle,
}: IProps): React.JSX.Element {
  return (
    <Pressable onPress={onPress}>
      <YStack
        paddingHorizontal="$3"
        paddingVertical="$1"
        height={48}
        justifyContent="center"
      >
        <XStack alignItems="center" space="$2">
          {accessoryLeft}
          <YStack space="$1">
            <Text
              {...(labelStyle === 'large'
                ? { fontSize: '$4', fontWeight: 'bold' }
                : { fontSize: '$3' })}
            >
              {label}
            </Text>
            {subtitle != null && (
              <Text color="$secondary" fontSize="$2">
                {subtitle}
              </Text>
            )}
          </YStack>

          <XStack marginLeft="auto" alignItems="center" space="$2">
            {label != null && <Text color="$secondary">{rightLabel}</Text>}
            {accessoryRight}
            {switchValue != null && onSwitchValueChange !== null && (
              <Switch value={switchValue} onValueChange={onSwitchValueChange} />
            )}
            {chevron === true && <ChevronRight size={20} color="$accent" />}
          </XStack>
        </XStack>
      </YStack>
    </Pressable>
  );
}
