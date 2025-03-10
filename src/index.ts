// Reexport the native module. On web, it will be resolved to ReactNativePdfCoverModule.web.ts
// and on native platforms to ReactNativePdfCoverModule.ts
export { default } from './ReactNativePdfCoverModule';
export { default as ReactNativePdfCoverView } from './ReactNativePdfCoverView';
export * from  './ReactNativePdfCover.types';
