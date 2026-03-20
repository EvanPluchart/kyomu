import { describe, it, expect } from "vitest";
import {
  getThumbnailPath,
  thumbnailExists,
  generateThumbnail,
  generateMissingThumbnails,
} from "@/lib/services/thumbnails";
import path from "path";

describe("getThumbnailPath", () => {
  it("retourne le bon chemin pour un comic donné", () => {
    const result = getThumbnailPath(42);
    expect(result).toContain(path.join("thumbnails", "42.webp"));
  });

  it("retourne un chemin avec l'extension .webp", () => {
    const result = getThumbnailPath(1);
    expect(result.endsWith(".webp")).toBe(true);
  });

  it("inclut l'id du comic dans le nom de fichier", () => {
    const result = getThumbnailPath(123);
    expect(path.basename(result)).toBe("123.webp");
  });
});

describe("thumbnailExists", () => {
  it("retourne false pour un comic inexistant", async () => {
    const exists = await thumbnailExists(999999);
    expect(exists).toBe(false);
  });

  it("retourne false pour un id négatif", async () => {
    const exists = await thumbnailExists(-1);
    expect(exists).toBe(false);
  });
});

describe("exports", () => {
  it("exporte getThumbnailPath en tant que fonction", () => {
    expect(typeof getThumbnailPath).toBe("function");
  });

  it("exporte generateThumbnail en tant que fonction", () => {
    expect(typeof generateThumbnail).toBe("function");
  });

  it("exporte thumbnailExists en tant que fonction", () => {
    expect(typeof thumbnailExists).toBe("function");
  });

  it("exporte generateMissingThumbnails en tant que fonction", () => {
    expect(typeof generateMissingThumbnails).toBe("function");
  });
});
