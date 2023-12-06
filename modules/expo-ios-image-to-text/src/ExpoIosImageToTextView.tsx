import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoIosImageToTextViewProps } from './ExpoIosImageToText.types';

const NativeView: React.ComponentType<ExpoIosImageToTextViewProps> =
  requireNativeViewManager('ExpoIosImageToText');

export default function ExpoIosImageToTextView(
  props: ExpoIosImageToTextViewProps,
): React.JSX.Element {
  return <NativeView {...props} />;
}
