import { LayoutChangeEvent } from 'react-native';
import { useCallback, useState } from 'react';

interface UseLayoutWidth {
  width?: number;
  onLayout: (event: LayoutChangeEvent) => void;
}

export const useLayoutWidth = (): UseLayoutWidth => {
  const [width, setWidth] = useState<number>();

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    // Subtract two pixels to account for the border width
    setWidth(e.nativeEvent.layout.width - 2);
  }, []);

  return {
    width,
    onLayout,
  };
};
