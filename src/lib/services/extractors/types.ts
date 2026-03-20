export interface PageInfo {
  index: number;
  filename: string;
  size: number;
}

export interface ComicExtractor {
  getPageCount(): Promise<number>;
  getPageList(): Promise<PageInfo[]>;
  getPage(index: number): Promise<Buffer>;
  close(): Promise<void>;
}
