import { registerWebModule, NativeModule } from 'expo';

import { ReactNativePdfCoverModuleEvents } from './ReactNativePdfCover.types';

class ReactNativePdfCoverModule extends NativeModule<ReactNativePdfCoverModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativePdfCoverModule);
