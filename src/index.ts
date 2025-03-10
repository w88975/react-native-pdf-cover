import type { ImageSourcePropType, ImageURISource } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";

import type { PDFCoverItem } from "./ReactNativePdfCover.types";
import ReactNativePdfCover from "./ReactNativePdfCoverModule";

export type Source = {
  uri?: ImageSourcePropType | undefined;
  headers?: {
    [key: string]: string;
  };
  cache?: boolean;
  cacheFileName?: string;
  expiration?: number;
  method?: string;
};

type getPDFCoverFunction = {
  source: ImageURISource | undefined;
  password?: string | undefined;
  page?: number | undefined;
  size?:
    | {
        width: number;
        height: number;
      }
    | undefined;
  scale?: number | undefined;
};

const makeSourceToBlobPath = async (source: ImageURISource | undefined) => {
  if (!source) {
    throw Error("[react-native-pdf-cover] must need source.");
  }

  if (typeof source === "string") {
    //@ts-ignore
    return decodeURIComponent(source.replace(/file:\/\//i, ""));
  }

  if (typeof source === "number") {
    throw Error(
      "[react-native-pdf-cover] Local asset numbers are not supported"
    );
  }

  if (!source.uri) {
    throw Error("[react-native-pdf-cover] Source URI is required");
  }

  const uri = source.uri;
  const isNetwork = !!(uri && uri.match(/^https?:\/\//));
  const isAsset = !!(uri && uri.match(/^bundle-assets:\/\//));
  const isBase64 = !!(uri && uri.match(/^data:application\/pdf;base64/));

  if (!isNetwork && !isAsset && !isBase64) {
    // Local file
    return decodeURIComponent(uri.replace(/file:\/\//i, ""));
  }

  try {
    const response = await ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: "pdf",
    }).fetch("GET", uri, source.headers);

    return response.path();
  } catch (error) {
    throw Error(`[react-native-pdf-cover] Failed to download PDF: ${error}`);
  }
};

export async function getPDFCover(
  params: getPDFCoverFunction
): Promise<PDFCoverItem> {
  const { source, password, page = 1.0, size, scale = 1 } = params;
  const path = await makeSourceToBlobPath(source);

  if (!path) {
    throw Error("[react-native-pdf-cover]The `path` parameter must be passed!");
  }

  const PDFCover = await ReactNativePdfCover.getPdfCover(
    path,
    password,
    page,
    size?.width || null,
    size?.height || null,
    scale
  );

  return PDFCover;
}

export async function getPdfCoverList(
  params: Omit<getPDFCoverFunction, "page" | "size">
): Promise<PDFCoverItem[]> {
  const { source, password, scale } = params;
  const path = await makeSourceToBlobPath(source);

  if (!path) {
    throw Error("[react-native-pdf-cover]The `path` parameter must be passed!");
  }

  const PDFCoverList = await ReactNativePdfCover.getPdfCoverList(
    path,
    password,
    scale
  );

  return PDFCoverList;
}
