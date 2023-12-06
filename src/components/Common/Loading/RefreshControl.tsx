import React from 'react';
import {
  RefreshControl as RNRefreshControl,
  RefreshControlProps,
} from 'react-native';
import { useTheme } from 'tamagui';

interface IProps extends RefreshControlProps {
  refreshing: boolean;
  onRefresh: () => unknown;
}

/**
 * Same as the default RN RefreshControl, but customized with the current theme's tint color
 * @param refreshing
 * @param onRefresh
 * @param rest
 * @constructor
 */
export default function RefreshControl({
  refreshing,
  onRefresh,
  ...rest
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.secondary.val as string}
      {...rest}
    />
  );
}
