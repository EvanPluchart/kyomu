import { describe, it, expect } from "vitest";
import { PdfExtractor } from "@/lib/services/extractors/pdf";

describe("PdfExtractor", () => {
  it("doit exporter la classe PdfExtractor", () => {
    expect(PdfExtractor).toBeDefined();
  });

  it("doit implémenter l'interface ComicExtractor", () => {
    const extractor = new PdfExtractor("/fake/path.pdf");
    expect(extractor.getPageCount).toBeDefined();
    expect(extractor.getPageList).toBeDefined();
    expect(extractor.getPage).toBeDefined();
    expect(extractor.close).toBeDefined();
  });
});
