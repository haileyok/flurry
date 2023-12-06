import React, { useCallback, useState } from 'react';
import { Text, useTheme, XStack } from 'tamagui';
import { IconProps } from '@tamagui/helpers-icon';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { playHaptic } from '@src/lib';

interface TopTabsContextParams {
  onPress: (index: number) => void;
  selectedIndex: number;
  backgroundColor?: string;
  selectedBackgroundColor?: string;
}

const TopTabsContext = React.createContext<TopTabsContextParams>(
  {} as TopTabsContextParams,
);

const useTopTabsContext = (): TopTabsContextParams =>
  React.useContext(TopTabsContext);

interface ITabBarItem {
  name: string;
  Icon?: React.ComponentType<IconProps>;
}

interface IProps {
  initialIndex: number;
  tabs: ITabBarItem[];
  pagerViewRef: React.RefObject<any>;
  onIndexChange?: (index: number) => void;
  backgroundColor?: string;
  selectedBackgroundColor?: string;
  justifyTabs?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}

export interface TopTabsRef {
  setPage: (index: number) => void;
  selectedIndex: number;
}

const TopTabs = React.forwardRef<TopTabsRef, IProps>(function TopTabsInner(
  {
    initialIndex,
    onIndexChange,
    tabs,
    pagerViewRef,
    backgroundColor,
    selectedBackgroundColor,
    justifyTabs = 'space-evenly',
  }: IProps,
  ref,
): React.JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const onPress = useCallback(
    (index: number) => {
      playHaptic();
      setSelectedIndex(index);
      pagerViewRef?.current?.jumpToTab(tabs[index].name);
      onIndexChange?.(index);
    },
    [pagerViewRef, tabs, onIndexChange],
  );

  React.useImperativeHandle(ref, () => ({
    setPage: onPress,
    selectedIndex,
  }));

  return (
    <TopTabsContext.Provider
      value={{
        onPress,
        selectedIndex,
        backgroundColor,
        selectedBackgroundColor,
      }}
    >
      <XStack
        backgroundColor={backgroundColor}
        height={50}
        alignItems="center"
        space="$3"
        paddingHorizontal="$4"
        justifyContent={justifyTabs}
      >
        {tabs.map((item, index) => (
          <TabItem {...item} index={index} key={index} />
        ))}
      </XStack>
    </TopTabsContext.Provider>
  );
});

interface ITabBarItemProps extends ITabBarItem {
  index: number;
}

function TabItem({ name, Icon, index }: ITabBarItemProps): React.JSX.Element {
  const theme = useTheme();

  const { selectedIndex, backgroundColor, selectedBackgroundColor, onPress } =
    useTopTabsContext();

  const scale = useDerivedValue(
    () => (selectedIndex === index ? withTiming(1.1) : withTiming(1)),
    [selectedIndex, index],
  );

  const color = useDerivedValue(
    () =>
      selectedIndex === index
        ? withTiming(selectedBackgroundColor ?? (theme.fg.val as string))
        : withTiming(backgroundColor ?? (theme.bg.val as string)),
    [selectedIndex, index],
  );

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: color.value,
    };
  });

  const onPressOuter = useCallback(() => {
    onPress(index);
  }, [onPress, index]);

  return (
    <Animated.View style={[style, { borderRadius: 50 }]}>
      <XStack
        space="$2"
        alignItems="center"
        paddingHorizontal="$2.5"
        paddingVertical="$1.5"
        onPress={onPressOuter}
        hitSlop={3}
      >
        {Icon != null && <Icon size={20} />}
        <Text fontSize="$3" fontWeight="bold">
          {name}
        </Text>
      </XStack>
    </Animated.View>
  );
}

export default React.memo(TopTabs);
