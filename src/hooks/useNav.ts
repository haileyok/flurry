import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

export const useNav = <
  ParamList extends ParamListBase,
  RouteName extends string = any,
>(): NativeStackNavigationProp<ParamList, RouteName> =>
  useNavigation<NativeStackNavigationProp<ParamList, RouteName>>();
