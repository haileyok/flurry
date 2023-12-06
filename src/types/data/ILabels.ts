export type LabelType =
  | 'nsfw'
  | 'nudity'
  | 'suggestive'
  | 'gore'
  | 'hate'
  | 'spam'
  | 'impersonation';

export interface ILabels {
  nsfw: boolean;
  nudity: boolean;
  suggestive: boolean;
  gore: boolean;
  hate: boolean;
  spam: boolean;
  impersonation: boolean;

  warning?: string;
  message?: string;

  isHidden: boolean;
  isRendered: boolean;
}
