import React from 'react';
import {
  MaterialTabBar,
  MaterialTabBarProps,
} from 'react-native-collapsible-tab-view';
import { useTheme } from 'tamagui';
import { StyleSheet } from 'react-native';

export default function ProfileTabsBar(
  props: MaterialTabBarProps<any>,
): React.JSX.Element {
  const theme = useTheme();

  return (
    <MaterialTabBar
      {...props}
      activeColor={theme.color?.val as string}
      inactiveColor={theme.secondary?.val as string}
      labelStyle={styles.label}
      indicatorStyle={{ backgroundColor: theme.accent.val as string }}
      tabStyle={styles.tab}
    />
  );
}

const styles = StyleSheet.create({
  tab: {
    padding: 5,
    margin: 5,
    height: 35,
  },
  label: {
    textTransform: 'capitalize',
  },
});
