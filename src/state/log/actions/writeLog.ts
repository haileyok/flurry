import { makeCurrentTimestamp } from '@src/lib';
import { useLogStore } from '@src/state/log';

export const writeLog = (message: string): void => {
  const time = makeCurrentTimestamp();
  // eslint-disable-next-line no-console
  if (__DEV__) console.log(`[Log] ${message}`);

  useLogStore.setState((state) => {
    state.messages.unshift({
      message,
      time,
      type: 'info',
    });

    if (state.messages.length > 50) {
      state.messages.pop();
    }
  });
};
