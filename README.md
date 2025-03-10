# react-native-pdf-cover

High-performance PDF cover image extraction using native PDF rendering engines:
- Android: Uses `PdfRenderer` from Android Framework
- iOS: Uses `PDFKit` from Apple's native framework

# API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/react-native-pdf-cover/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/react-native-pdf-cover/)

## Methods

### getPDFCover(params)

Gets a cover image from a specific page of a PDF file.

#### Parameters

- `params` (Object)
  - `source` (ImageURISource): The source of the PDF file. Can be a URI (remote URL, local file path, or base64 string)
  - `password` (string, optional): Password if the PDF is encrypted
  - `page` (number, optional): Page number to get the cover from (default: 1)
  - `size` (Object, optional): Desired size of the output image
    - `width` (number): Width of the output image
    - `height` (number): Height of the output image
  - `scale` (number, optional): Scale factor for the output image (default: 1)

#### Returns

Promise resolving to a PDFCoverItem object.

### getPdfCoverList(params)

Gets cover images from all pages in a PDF file.

#### Parameters

- `params` (Object)
  - `source` (ImageURISource): The source of the PDF file. Can be a URI (remote URL, local file path, or base64 string)
  - `password` (string, optional): Password if the PDF is encrypted
  - `scale` (number, optional): Scale factor for the output images (default: 1)

#### Returns

Promise resolving to an array of PDFCoverItem objects.

## Example

```javascript
import { getPDFCover, getPdfCoverList } from 'react-native-pdf-cover';

// Get a single cover
const cover = await getPDFCover({
  source: { uri: 'https://example.com/document.pdf' },
  page: 1,
  size: { width: 800, height: 600 },
  scale: 2
});

// Get all covers
const covers = await getPdfCoverList({
  source: { uri: 'https://example.com/document.pdf' },
  scale: 1
});
```

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install react-native-pdf-cover react-native-blob-util --save
```

### Configure for Android




### Configure for iOS

Run `npx pod-install` after installing the npm package.

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
