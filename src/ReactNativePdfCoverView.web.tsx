import * as React from 'react';

import { ReactNativePdfCoverViewProps } from './ReactNativePdfCover.types';

export default function ReactNativePdfCoverView(props: ReactNativePdfCoverViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
