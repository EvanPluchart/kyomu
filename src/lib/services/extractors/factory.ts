import type { ComicExtractor } from "./types";
import { CbzExtractor } from "./cbz";
import { CbrExtractor } from "./cbr";
import { FolderExtractor } from "./folder";
import { PdfExtractor } from "./pdf";

export function getExtractor(format: string, filePath: string): ComicExtractor {
  switch (format) {
    case "cbz":
      return new CbzExtractor(filePath);
    case "cbr":
      return new CbrExtractor(filePath);
    case "pdf":
      return new PdfExtractor(filePath);
    case "folder":
      return new FolderExtractor(filePath);
    default:
      throw new Error(`Format non supporté : ${format}`);
  }
}
