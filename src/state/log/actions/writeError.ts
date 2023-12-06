import { makeCurrentTimestamp } from '@src/lib';
import { useLogStore } from '@src/state/log';

export const writeError = (message: string): void => {
  const time = makeCurrentTimestamp();
  // eslint-disable-next-line no-console
  if (__DEV__) console.log(`[Error] ${message}`);

  useLogStore.setState((state) => {
    state.messages.unshift({
      message,
      time,
      type: 'error',
    });

    if (state.messages.length > 50) {
      state.messages.pop();
    }
  });
};
