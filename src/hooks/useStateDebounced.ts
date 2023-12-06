import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

interface UseStateDebounced<T> {
  state: [T, React.Dispatch<React.SetStateAction<T>>];
  handleChange: (v: T) => void;
  debounceChange: (v: T) => void;
}

export const useStateDebounced = <T>(
  initialValue: T,
  delay: number = 300,
): UseStateDebounced<T> => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((v: T): void => {
    setValue(v);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChange = useCallback(debounce(handleChange, delay), []);

  return {
    state: [value, setValue],
    handleChange,
    debounceChange,
  };
};
