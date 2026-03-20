import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import type { ComicExtractor, PageInfo } from "./types";
import { naturalSort, isImageFile } from "./utils";

const execFile = promisify(execFileCb);

export class CbrExtractor implements ComicExtractor {
  private filePath: string;
  private cachedFiles: string[] | null = null;
  private unrarChecked = false;
  private tempDir: string | null = null;

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

    // unrar-free utilise --list au lieu de lb
    const { stdout } = await execFile("unrar", ["--list", this.filePath]);

    // Parser la sortie de unrar-free --list
    // Format : lignes avec le nom de fichier, suivies d'une ligne avec taille/date
    const files: string[] = [];
    const lines = stdout.split("\n");
    let pastHeader = false;

    for (const line of lines) {
      if (line.includes("------")) {
        pastHeader = true;
        continue;
      }
      if (!pastHeader) continue;
      if (line.trim() === "" || line.trim() === "All OK") continue;

      // Les lignes de nom de fichier commencent par un espace et ne contiennent pas de date
      const trimmed = line.trimStart();
      if (trimmed.length > 0 && !(/^\d+\s+\d{2}-\d{2}-\d{2}/.test(trimmed))) {
        if (isImageFile(trimmed)) {
          files.push(trimmed);
        }
      }
    }

    this.cachedFiles = files.sort(naturalSort);
    return this.cachedFiles;
  }

  private async ensureTempDir(): Promise<string> {
    if (!this.tempDir) {
      this.tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "kyomu-cbr-"));
    }
    return this.tempDir;
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

    // unrar-free ne supporte pas p -inul, on extrait dans un dossier temp
    const tempDir = await this.ensureTempDir();

    await execFile(
      "unrar",
      ["--extract", "--extract-no-paths", "--force", this.filePath, entryName, tempDir + "/"],
      { maxBuffer: 50 * 1024 * 1024 }
    );

    const extractedPath = path.join(tempDir, path.basename(entryName));
    const buffer = await fs.readFile(extractedPath);
    await fs.unlink(extractedPath).catch(() => {});

    return buffer;
  }

  async close(): Promise<void> {
    if (this.tempDir) {
      await fs.rm(this.tempDir, { recursive: true, force: true }).catch(() => {});
      this.tempDir = null;
    }
  }
}
