import dayjs from 'dayjs';

export const makeTimeFrom = (timestamp: string | undefined): string => {
  return dayjs(timestamp).fromNow(true);
};
