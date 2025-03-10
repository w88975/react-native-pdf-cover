import { NativeModule, requireNativeModule } from 'expo';

import { ReactNativePdfCoverModuleEvents } from './ReactNativePdfCover.types';

declare class ReactNativePdfCoverModule extends NativeModule<ReactNativePdfCoverModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativePdfCoverModule>('ReactNativePdfCover');
