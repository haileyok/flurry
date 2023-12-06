import * as React from 'react';

import { ExpoIosImageToTextViewProps } from './ExpoIosImageToText.types';

export default function ExpoIosImageToTextView(
  props: ExpoIosImageToTextViewProps,
): React.JSX.Element {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
