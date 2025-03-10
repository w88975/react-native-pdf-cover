export type OnLoadEventPayload = {
  url: string;
};

export type PDFCoverItem = {
  cover: string;
  page: number;
  size: {
    width: number;
    height: number;
  };
  pageCount: number;
};
