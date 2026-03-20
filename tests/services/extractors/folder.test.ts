import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { FolderExtractor } from "@/lib/services/extractors/folder";
import fs from "fs";
import path from "path";
import os from "os";

const TEST_DIR = path.join(os.tmpdir(), "kyomu-test-folder");

beforeAll(() => {
  fs.mkdirSync(TEST_DIR, { recursive: true });
  // Créer 3 fichiers image factices
  fs.writeFileSync(path.join(TEST_DIR, "page_01.jpg"), "fake-jpeg-1");
  fs.writeFileSync(path.join(TEST_DIR, "page_02.jpg"), "fake-jpeg-2");
  fs.writeFileSync(path.join(TEST_DIR, "page_10.jpg"), "fake-jpeg-10");
  // Créer un fichier non-image (doit être ignoré)
  fs.writeFileSync(path.join(TEST_DIR, "thumbs.db"), "ignored");
  // Créer un sous-dossier (doit être ignoré)
  fs.mkdirSync(path.join(TEST_DIR, "subfolder"), { recursive: true });
  fs.writeFileSync(path.join(TEST_DIR, "subfolder", "image.jpg"), "should-be-ignored");
});

afterAll(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("FolderExtractor", () => {
  it("retourne le bon nombre de pages", async () => {
    const ext = new FolderExtractor(TEST_DIR);
    expect(await ext.getPageCount()).toBe(3);
    await ext.close();
  });

  it("retourne les pages dans l'ordre naturel", async () => {
    const ext = new FolderExtractor(TEST_DIR);
    const pages = await ext.getPageList();
    expect(pages.map((p) => p.filename)).toEqual([
      "page_01.jpg",
      "page_02.jpg",
      "page_10.jpg",
    ]);
    await ext.close();
  });

  it("retourne le contenu d'une page", async () => {
    const ext = new FolderExtractor(TEST_DIR);
    const buffer = await ext.getPage(0);
    expect(buffer.toString()).toBe("fake-jpeg-1");
    await ext.close();
  });

  it("ignore les fichiers non-image", async () => {
    const ext = new FolderExtractor(TEST_DIR);
    const pages = await ext.getPageList();
    const filenames = pages.map((p) => p.filename);
    expect(filenames).not.toContain("thumbs.db");
    await ext.close();
  });

  it("ignore les sous-dossiers", async () => {
    const ext = new FolderExtractor(TEST_DIR);
    const pages = await ext.getPageList();
    expect(pages.length).toBe(3); // seulement les 3 images du dossier racine
    await ext.close();
  });

  it("throw une erreur pour un index invalide", async () => {
    const ext = new FolderExtractor(TEST_DIR);
    await expect(ext.getPage(99)).rejects.toThrow("Page 99 non trouvée");
    await ext.close();
  });
});
