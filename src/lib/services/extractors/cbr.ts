import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
import type { ComicExtractor, PageInfo } from "./types";
import { naturalSort, isImageFile } from "./utils";

const execFile = promisify(execFileCb);

export class CbrExtractor implements ComicExtractor {
  private filePath: string;
  private cachedFiles: string[] | null = null;
  private unrarChecked = false;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async checkUnrar(): Promise<void> {
    if (this.unrarChecked) return;
    try {
      await execFile("unrar", ["--version"]);
    } catch {
      throw new Error(
        "Le binaire unrar n'est pas installé. Installez-le avec : apt-get install unrar-free"
      );
    }
    this.unrarChecked = true;
  }

  private async listFiles(): Promise<string[]> {
    if (this.cachedFiles !== null) return this.cachedFiles;

    await this.checkUnrar();

    const { stdout } = await execFile("unrar", ["lb", this.filePath]);
    const files = stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter((line) => isImageFile(line))
      .sort(naturalSort);

    this.cachedFiles = files;
    return files;
  }

  async getPageCount(): Promise<number> {
    const files = await this.listFiles();
    return files.length;
  }

  async getPageList(): Promise<PageInfo[]> {
    const files = await this.listFiles();
    return files.map((filename, index) => ({
      index,
      filename,
      size: 0,
    }));
  }

  async getPage(index: number): Promise<Buffer> {
    const files = await this.listFiles();
    const entryName = files[index];
    if (entryName === undefined) {
      throw new Error(`Page ${index} introuvable dans l'archive`);
    }

    const { stdout } = await execFile(
      "unrar",
      ["p", "-inul", this.filePath, entryName],
      { encoding: "buffer", maxBuffer: 50 * 1024 * 1024 }
    );

    return stdout as unknown as Buffer;
  }

  async close(): Promise<void> {
    // Rien à nettoyer : pas de dossier temporaire avec l'approche stdout
  }
}
