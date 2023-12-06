import { SetStateAction, useCallback, useReducer, useRef } from 'react';
import {
  LayoutAnimation,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';

interface UseExpandText {
  onTextLayout: (e: NativeSyntheticEvent<TextLayoutEventData>) => void;
  isExpandable: boolean;
  isExpanded: boolean;
  numberOfLines: number | undefined;
  toggle: () => void;
}

interface UseExpandTextState {
  isExpandable: boolean;
  isExpanded: boolean;
  numberOfLines: number | undefined;
}

const reducer = (
  state: UseExpandTextState,
  action: SetStateAction<UseExpandTextState>,
): UseExpandTextState => {
  return { ...state, ...action };
};

export const useExpandText = (
  text: string | undefined,
  defaultNumberOfLines = 3,
): UseExpandText => {
  const [state, dispatch] = useReducer(reducer, {
    isExpandable: false,
    isExpanded: false,
    numberOfLines: defaultNumberOfLines,
  });

  const estimatedLineLength = useRef(0);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      // Do nothing if there is no text
      if (text == null) return;

      const { lines } = e.nativeEvent;

      // Get the number of visible characters
      const visibleCharacterCount = lines.reduce((acc, l) => {
        if (
          estimatedLineLength.current === 0 ||
          estimatedLineLength.current < l.text.length
        ) {
          estimatedLineLength.current = l.text.length;
        }

        return acc + l.text.length;
      }, 0);

      // If the number of visible characters is less than the total number of
      // characters, then the text is expandable

      dispatch({
        ...state,
        isExpandable: visibleCharacterCount < text.length,
        numberOfLines: lines.length,
      });
    },
    [state, text],
  );

  const toggle = useCallback(() => {
    if (!state.isExpandable) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    dispatch({
      ...state,
      isExpanded: !state.isExpanded,
      numberOfLines: state.isExpanded
        ? defaultNumberOfLines
        : text!.length / estimatedLineLength.current,
    });
  }, [defaultNumberOfLines, state, text]);

  return {
    onTextLayout,
    isExpandable: state.isExpandable,
    isExpanded: state.isExpanded,
    numberOfLines: state.numberOfLines,
    toggle,
  };
};
