import { requireNativeView } from 'expo';
import * as React from 'react';

import { ReactNativePdfCoverViewProps } from './ReactNativePdfCover.types';

const NativeView: React.ComponentType<ReactNativePdfCoverViewProps> =
  requireNativeView('ReactNativePdfCover');

export default function ReactNativePdfCoverView(props: ReactNativePdfCoverViewProps) {
  return <NativeView {...props} />;
}
