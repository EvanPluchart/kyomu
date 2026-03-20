import { describe, it, expect } from "vitest";
import { CbrExtractor } from "@/lib/services/extractors/cbr";

describe("CbrExtractor", () => {
  it("doit exporter la classe CbrExtractor", () => {
    expect(CbrExtractor).toBeDefined();
  });

  it("doit implémenter l'interface ComicExtractor", () => {
    const extractor = new CbrExtractor("/fake/path.cbr");
    expect(extractor.getPageCount).toBeDefined();
    expect(extractor.getPageList).toBeDefined();
    expect(extractor.getPage).toBeDefined();
    expect(extractor.close).toBeDefined();
  });
});
