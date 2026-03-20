import { describe, it, expect } from "vitest";
import { scanLibrary, getScanStatus } from "@/lib/services/scanner";
import { slugify, extractNumberFromFilename } from "@/lib/services/file-utils";

describe("scanner exports", () => {
  it("exporte scanLibrary en tant que fonction", () => {
    expect(typeof scanLibrary).toBe("function");
  });

  it("exporte getScanStatus en tant que fonction", () => {
    expect(typeof getScanStatus).toBe("function");
  });
});

describe("getScanStatus", () => {
  it("retourne isScanning: false initialement", () => {
    const status = getScanStatus();
    expect(status.isScanning).toBe(false);
  });

  it("retourne lastScanAt: null initialement", () => {
    const status = getScanStatus();
    expect(status.lastScanAt).toBeNull();
  });

  it("retourne lastResult: null initialement", () => {
    const status = getScanStatus();
    expect(status.lastResult).toBeNull();
  });
});

describe("slugify", () => {
  it("convertit en minuscules", () => {
    expect(slugify("Batman")).toBe("batman");
  });

  it("remplace les espaces par des tirets", () => {
    expect(slugify("Batman et Robin")).toBe("batman-et-robin");
  });

  it("supprime les accents", () => {
    expect(slugify("Étoile noire")).toBe("etoile-noire");
  });

  it("supprime les caractères spéciaux", () => {
    expect(slugify("The Dark Knight!")).toBe("the-dark-knight");
  });

  it("fusionne les tirets multiples", () => {
    expect(slugify("Batman  -  Robin")).toBe("batman-robin");
  });

  it("supprime les tirets en début et fin", () => {
    expect(slugify("  batman  ")).toBe("batman");
  });

  it("gère une chaîne vide", () => {
    expect(slugify("")).toBe("");
  });
});

describe("extractNumberFromFilename", () => {
  it("extrait le numéro d'un fichier CBZ simple", () => {
    expect(extractNumberFromFilename("Batman 001.cbz")).toBe(1);
  });

  it("extrait le numéro avec dièse", () => {
    expect(extractNumberFromFilename("Issue #42.cbr")).toBe(42);
  });

  it("retourne le dernier nombre du nom de fichier", () => {
    expect(extractNumberFromFilename("Volume 2 Issue 15.cbz")).toBe(15);
  });

  it("retourne null si aucun numéro", () => {
    expect(extractNumberFromFilename("Batman.cbz")).toBeNull();
  });

  it("fonctionne sans extension", () => {
    expect(extractNumberFromFilename("Chapter 007")).toBe(7);
  });
});
