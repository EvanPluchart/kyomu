import fs from "fs/promises";
import path from "path";
import type { ComicExtractor, PageInfo } from "./types";
import { naturalSort, isImageFile } from "./utils";

export class FolderExtractor implements ComicExtractor {
  private dirPath: string;
  private pages: PageInfo[] | null = null;

  constructor(dirPath: string) {
    this.dirPath = dirPath;
  }

  private async ensureLoaded(): Promise<void> {
    if (this.pages) return;

    const entries = await fs.readdir(this.dirPath, { withFileTypes: true });

    // Filtrer : uniquement les fichiers (pas les sous-dossiers) qui sont des images
    const imageFiles = entries
      .filter((entry) => entry.isFile() && isImageFile(entry.name))
      .map((entry) => entry.name)
      .sort(naturalSort);

    // Construire les PageInfo avec les tailles
    this.pages = await Promise.all(
      imageFiles.map(async (filename, index) => {
        const filePath = path.join(this.dirPath, filename);
        const stat = await fs.stat(filePath);
        return { index, filename, size: stat.size };
      })
    );
  }

  async getPageCount(): Promise<number> {
    await this.ensureLoaded();
    return this.pages!.length;
  }

  async getPageList(): Promise<PageInfo[]> {
    await this.ensureLoaded();
    return this.pages!;
  }

  async getPage(index: number): Promise<Buffer> {
    await this.ensureLoaded();
    const page = this.pages![index];
    if (!page) {
      throw new Error(`Page ${index} non trouvée`);
    }
    return fs.readFile(path.join(this.dirPath, page.filename));
  }

  async close(): Promise<void> {
    this.pages = null;
  }
}
