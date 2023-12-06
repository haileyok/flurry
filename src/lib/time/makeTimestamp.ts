import dayjs from 'dayjs';

export const makeTimestamp = (timestamp: string | undefined): string => {
  return dayjs(timestamp).format('lll').toString();
};

export const makeCurrentTimestamp = (): string => {
  return dayjs().format('lll').toString();
};
