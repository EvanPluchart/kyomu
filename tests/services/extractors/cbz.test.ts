import { describe, it, expect, afterEach } from "vitest";
import { CbzExtractor } from "@/lib/services/extractors/cbz";
import path from "path";

const TEST_CBZ = path.join(__dirname, "../../fixtures/test.cbz");

describe("CbzExtractor", () => {
  let extractor: CbzExtractor;

  afterEach(async () => {
    if (extractor) {
      await extractor.close();
    }
  });

  it("getPageCount() retourne le bon nombre de pages", async () => {
    extractor = new CbzExtractor(TEST_CBZ);
    const count = await extractor.getPageCount();
    expect(count).toBe(3);
  });

  it("getPageList() retourne les pages dans l'ordre naturel", async () => {
    extractor = new CbzExtractor(TEST_CBZ);
    const pages = await extractor.getPageList();

    expect(pages).toHaveLength(3);
    expect(pages[0].filename).toBe("page001.jpg");
    expect(pages[1].filename).toBe("page002.jpg");
    expect(pages[2].filename).toBe("page010.jpg");

    pages.forEach((page, index) => {
      expect(page.index).toBe(index);
    });
  });

  it("getPage(0) retourne un Buffer non vide", async () => {
    extractor = new CbzExtractor(TEST_CBZ);
    const buffer = await extractor.getPage(0);

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it("close() ne throw pas", async () => {
    extractor = new CbzExtractor(TEST_CBZ);
    await extractor.getPageCount();
    await expect(extractor.close()).resolves.not.toThrow();
  });
});
