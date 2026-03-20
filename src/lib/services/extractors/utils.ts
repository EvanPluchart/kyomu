export function naturalSort(a: string, b: string): number {
  const splitNatural = (s: string): Array<string | number> =>
    s.split(/(\d+)/).map((part) => {
      const n = parseInt(part, 10);
      return isNaN(n) ? part : n;
    });

  const partsA = splitNatural(a);
  const partsB = splitNatural(b);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    if (i >= partsA.length) return -1;
    if (i >= partsB.length) return 1;

    const partA = partsA[i];
    const partB = partsB[i];

    if (typeof partA === "number" && typeof partB === "number") {
      if (partA !== partB) return partA - partB;
    } else {
      const strA = String(partA);
      const strB = String(partB);
      if (strA !== strB) return strA < strB ? -1 : 1;
    }
  }

  return 0;
}

export function isImageFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp" || ext === "gif";
}

export function isIgnoredFile(filename: string): boolean {
  const basename = filename.split("/").pop() ?? filename;

  if (filename.startsWith("__MACOSX/")) return true;
  if (basename.startsWith("._")) return true;
  if (basename.toLowerCase() === "thumbs.db") return true;
  if (basename === ".DS_Store") return true;
  if (!isImageFile(filename)) return true;

  return false;
}
