import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import type { ComicExtractor, PageInfo } from "./types";

const execFile = promisify(execFileCb);

export class PdfExtractor implements ComicExtractor {
  private filePath: string;
  private pageCount: number | null = null;
  private pdftoppmChecked = false;
  private tempDir: string | null = null;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async checkPdftoppm(): Promise<void> {
    if (this.pdftoppmChecked) return;
    try {
      await execFile("pdftoppm", ["-v"]);
    } catch (error) {
      // pdftoppm -v writes to stderr but exits 0 or 99 depending on version
      const err = error as { code?: number; stderr?: string };
      if (err.stderr?.includes("pdftoppm")) {
        this.pdftoppmChecked = true;
        return;
      }
      throw new Error(
        "Le binaire pdftoppm n'est pas installé. Installez-le avec : apt-get install poppler-utils"
      );
    }
    this.pdftoppmChecked = true;
  }

  private async getPageCountInternal(): Promise<number> {
    if (this.pageCount !== null) return this.pageCount;

    await this.checkPdftoppm();

    const { stdout } = await execFile("pdfinfo", [this.filePath]);
    const match = stdout.match(/Pages:\s+(\d+)/);
    this.pageCount = match ? parseInt(match[1], 10) : 0;
    return this.pageCount;
  }

  private async ensureTempDir(): Promise<string> {
    if (!this.tempDir) {
      this.tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "kyomu-pdf-"));
    }
    return this.tempDir;
  }

  async getPageCount(): Promise<number> {
    return this.getPageCountInternal();
  }

  async getPageList(): Promise<PageInfo[]> {
    const count = await this.getPageCountInternal();
    return Array.from({ length: count }, (_, i) => ({
      index: i,
      filename: `page-${String(i + 1).padStart(4, "0")}.jpg`,
      size: 0,
    }));
  }

  async getPage(index: number): Promise<Buffer> {
    const count = await this.getPageCountInternal();
    if (index < 0 || index >= count) {
      throw new Error(`Page ${index} introuvable dans le PDF`);
    }

    await this.checkPdftoppm();

    const pageNum = index + 1;
    const tempDir = await this.ensureTempDir();
    const outputPrefix = path.join(tempDir, "page");

    await execFile("pdftoppm", [
      "-jpeg",
      "-r",
      "200",
      "-f",
      String(pageNum),
      "-l",
      String(pageNum),
      "-singlefile",
      this.filePath,
      outputPrefix,
    ]);

    const outputFile = `${outputPrefix}.jpg`;
    const buffer = await fs.readFile(outputFile);
    await fs.unlink(outputFile).catch(() => {});

    return buffer;
  }

  async close(): Promise<void> {
    if (this.tempDir) {
      await fs.rm(this.tempDir, { recursive: true, force: true }).catch(() => {});
      this.tempDir = null;
    }
  }
}
