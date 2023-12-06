import { useFocusEffect } from '@react-navigation/core';
import { useCallback } from 'react';
import { AvoidSoftInput } from 'react-native-avoid-softinput';

export const useAvoidSoftView = (): void => {
  useFocusEffect(
    useCallback(() => {
      AvoidSoftInput.setShouldMimicIOSBehavior(true);

      return () => {
        AvoidSoftInput.setShouldMimicIOSBehavior(false);
      };
    }, []),
  );
};
