import { describe, it, expect } from "vitest";
import { generateRootFeed, generateSeriesFeed } from "@/lib/services/opds";

describe("OPDS service", () => {
  it("generateRootFeed retourne du XML valide", () => {
    const xml = generateRootFeed("http://localhost:3000");
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain("<feed");
    expect(xml).toContain("</feed>");
    expect(xml).toContain("Kyomu");
  });

  it("generateSeriesFeed inclut les series", () => {
    const xml = generateSeriesFeed("http://localhost:3000", [
      { id: 1, title: "Batman", author: "DC", comicsCount: 5, updatedAt: "2024-01-01T00:00:00Z" },
    ]);
    expect(xml).toContain("Batman");
    expect(xml).toContain("<entry>");
  });

  it("echappe les caracteres XML speciaux", () => {
    const xml = generateSeriesFeed("http://localhost:3000", [
      { id: 1, title: "Tom & Jerry", author: null, comicsCount: 1, updatedAt: "2024-01-01T00:00:00Z" },
    ]);
    expect(xml).toContain("Tom &amp; Jerry");
    expect(xml).not.toContain("Tom & Jerry");
  });
});
