import * as yauzl from "yauzl-promise";
import { type ComicExtractor, type PageInfo } from "./types";
import { isIgnoredFile, naturalSort } from "./utils";

export class CbzExtractor implements ComicExtractor {
  private filePath: string;
  private zipFile: yauzl.ZipFile | null = null;
  private pages: PageInfo[] | null = null;
  private entries: yauzl.Entry[] = [];

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async ensureOpen(): Promise<void> {
    if (this.zipFile) return;

    this.zipFile = await yauzl.open(this.filePath);
    const allEntries = await this.zipFile.readEntries();

    const imageEntries = allEntries.filter(
      (entry) => !isIgnoredFile(entry.filename),
    );

    imageEntries.sort((a, b) => naturalSort(a.filename, b.filename));

    this.entries = imageEntries;
    this.pages = imageEntries.map((entry, index) => ({
      index,
      filename: entry.filename,
      size: entry.uncompressedSize,
    }));
  }

  async getPageCount(): Promise<number> {
    await this.ensureOpen();
    return this.pages!.length;
  }

  async getPageList(): Promise<PageInfo[]> {
    await this.ensureOpen();
    return this.pages!;
  }

  async getPage(index: number): Promise<Buffer> {
    await this.ensureOpen();

    if (index < 0 || index >= this.entries.length) {
      throw new RangeError(`Index de page invalide : ${index}`);
    }

    const entry = this.entries[index];
    const stream = await entry.openReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk as Uint8Array));
    }

    return Buffer.concat(chunks);
  }

  async close(): Promise<void> {
    if (this.zipFile) {
      await this.zipFile.close();
      this.zipFile = null;
    }
  }
}
