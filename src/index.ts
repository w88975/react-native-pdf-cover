import type { PDFCoverItem } from "./ReactNativePdfCover.types";
import ReactNativePdfCover from "./ReactNativePdfCoverModule";

// Type definition for the parameters required to get a PDF cover image.
type getPDFCoverFunction = {
  // The path to the PDF file.
  path: string;
  // Optional password for unlocking the PDF, if it is password protected.
  password?: string | undefined;
  // Optional page number to get the cover from, defaults to the first page if not provided.
  page?: number | undefined;
  // Optional size object to specify the width and height of the cover image.
  size?:
    | {
        // Width of the cover image.
        width: number;
        // Height of the cover image.
        height: number;
      }
    | undefined;
  // Optional scale factor to resize the cover image.
  scale?: number | undefined;
};

export async function getPDFCover(
  params: getPDFCoverFunction
): Promise<PDFCoverItem> {
  const { path, password, page = 1.0, size, scale = 1 } = params;

  if (!path) {
    throw Error("[react-native-pdf-cover]The `path` parameter must be passed!");
  }
  console.log(
    ReactNativePdfCover.getPdfCover,
    path,
    password,
    page,
    size?.width || null,
    size?.height || null,
    scale
  );
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
  const { path, password, scale } = params;

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
