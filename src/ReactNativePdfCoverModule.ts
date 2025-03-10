import { requireNativeModule } from "expo";

import { PDFCoverItem } from "./ReactNativePdfCover.types";

declare class ReactNativePdfCoverModule {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  getPdfCover(
    path: string,
    password?: string,
    page?: number,
    width?: number | null,
    height?: number | null,
    scale?: number
  ): Promise<PDFCoverItem>;
  getPdfCoverList(
    path: string,
    password?: string,
    scale?: number
  ): Promise<PDFCoverItem[]>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativePdfCoverModule>(
  "ReactNativePdfCover"
);
