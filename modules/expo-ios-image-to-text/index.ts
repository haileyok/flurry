import ExpoIosImageToTextModule from './src/ExpoIosImageToTextModule';
import ExpoIosImageToTextView from './src/ExpoIosImageToTextView';
import {
  ChangeEventPayload,
  ExpoIosImageToTextViewProps,
} from './src/ExpoIosImageToText.types';

export async function getTextFromImageAsync(
  path: string,
): Promise<string[] | null> {
  const res = ExpoIosImageToTextModule.getTextFromImage(path);

  if (res == null) return null;

  return res;
}

export {
  ExpoIosImageToTextView,
  type ExpoIosImageToTextViewProps,
  type ChangeEventPayload,
};
