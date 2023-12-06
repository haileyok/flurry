export interface ILogMessage {
  message: string;
  time: string;
  type: 'info' | 'error' | 'warning';
}
