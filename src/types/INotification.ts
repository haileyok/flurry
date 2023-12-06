export interface INotification {
  type: 'likes' | 'follows' | 'replies' | 'reposts' | 'quotes' | 'mentions';
  creator: string;
  subject: string;
  uri?: string;
  text?: string;
}
