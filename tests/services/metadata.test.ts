import { describe, it, expect } from "vitest";
import { parseComicInfoXml, titleFromFilename } from "@/lib/services/metadata";
import fs from "fs";
import path from "path";

const SAMPLE_XML = fs.readFileSync(
  path.join(__dirname, "../fixtures/sample-comicinfo.xml"),
  "utf-8"
);

describe("parseComicInfoXml", () => {
  it("parse un ComicInfo.xml valide", () => {
    const info = parseComicInfoXml(SAMPLE_XML);
    expect(info.title).toBe("Batman: The Court of Owls");
    expect(info.series).toBe("Batman");
    expect(info.number).toBe(1);
    expect(info.writer).toBe("Scott Snyder");
    expect(info.year).toBe(2011);
    expect(info.publisher).toBe("DC Comics");
  });

  it("retourne null pour un XML vide", () => {
    const info = parseComicInfoXml("");
    expect(info.title).toBeNull();
  });

  it("retourne null pour un XML malformé", () => {
    const info = parseComicInfoXml("<not>valid<xml");
    expect(info.title).toBeNull();
  });
});

describe("titleFromFilename", () => {
  it("retire l'extension", () => {
    expect(titleFromFilename("Batman 001.cbz")).toBe("Batman 001");
  });

  it("gère les fichiers sans extension", () => {
    expect(titleFromFilename("Batman")).toBe("Batman");
  });
});
