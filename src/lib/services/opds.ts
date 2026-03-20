const MIME_NAVIGATION = "application/atom+xml;profile=opds-catalog;kind=navigation";
const MIME_ACQUISITION = "application/atom+xml;profile=opds-catalog;kind=acquisition";

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatMimeForFormat(format: string): string {
  switch (format.toLowerCase()) {
    case "cbz":
      return "application/x-cbz";
    case "cbr":
      return "application/x-cbr";
    case "folder":
      return "application/zip";
    default:
      return "application/octet-stream";
  }
}

function feedWrapper(
  id: string,
  title: string,
  updated: string,
  selfUrl: string,
  startUrl: string,
  selfType: string,
  entries: string,
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"
      xmlns:opds="http://opds-spec.org/2010/catalog">
  <id>${escapeXml(id)}</id>
  <title>${escapeXml(title)}</title>
  <updated>${updated}</updated>
  <link rel="self" href="${escapeXml(selfUrl)}" type="${selfType}"/>
  <link rel="start" href="${escapeXml(startUrl)}" type="${MIME_NAVIGATION}"/>
${entries}</feed>`;
}

export function generateRootFeed(baseUrl: string): string {
  const now = new Date().toISOString();
  const selfUrl = `${baseUrl}/api/opds`;

  const entry = `  <entry>
    <id>urn:kyomu:catalog:series</id>
    <title>Kyomu — Séries</title>
    <updated>${now}</updated>
    <link href="${escapeXml(`${baseUrl}/api/opds/series`)}" type="${MIME_NAVIGATION}"/>
  </entry>
`;

  return feedWrapper(
    "urn:kyomu:root",
    "Kyomu",
    now,
    selfUrl,
    selfUrl,
    MIME_NAVIGATION,
    entry,
  );
}

export function generateSeriesFeed(
  baseUrl: string,
  seriesList: {
    id: number;
    title: string;
    author: string | null;
    comicsCount: number | null;
    updatedAt: string;
  }[],
): string {
  const now = new Date().toISOString();
  const selfUrl = `${baseUrl}/api/opds/series`;

  const entries = seriesList
    .map((series) => {
      const detailUrl = `${baseUrl}/api/opds/series/${series.id}`;
      const authorLine = series.author
        ? `    <author><name>${escapeXml(series.author)}</name></author>\n`
        : "";
      const summaryLine =
        series.comicsCount !== null
          ? `    <summary>${series.comicsCount} comic${series.comicsCount !== 1 ? "s" : ""}</summary>\n`
          : "";

      return `  <entry>
    <id>urn:kyomu:series:${series.id}</id>
    <title>${escapeXml(series.title)}</title>
    <updated>${series.updatedAt}</updated>
${authorLine}${summaryLine}    <link href="${escapeXml(detailUrl)}" type="${MIME_ACQUISITION}"/>
  </entry>`;
    })
    .join("\n");

  return feedWrapper(
    "urn:kyomu:catalog:series",
    "Kyomu — Séries",
    now,
    selfUrl,
    `${baseUrl}/api/opds`,
    MIME_NAVIGATION,
    entries ? entries + "\n" : "",
  );
}

export function generateSeriesDetailFeed(
  baseUrl: string,
  seriesData: { id: number; title: string; author: string | null },
  comicsList: {
    id: number;
    title: string;
    number: number | null;
    format: string;
    filePath: string;
  }[],
): string {
  const now = new Date().toISOString();
  const selfUrl = `${baseUrl}/api/opds/series/${seriesData.id}`;

  const authorLine = seriesData.author
    ? `    <author><name>${escapeXml(seriesData.author)}</name></author>\n`
    : "";

  const entries = comicsList
    .map((comic) => {
      const mime = formatMimeForFormat(comic.format);
      const downloadUrl = `${baseUrl}/api/opds/download/${comic.id}`;
      const thumbnailUrl = `${baseUrl}/api/comics/${comic.id}/thumbnail`;

      return `  <entry>
    <id>urn:kyomu:comic:${comic.id}</id>
    <title>${escapeXml(comic.title)}</title>
    <updated>${now}</updated>
${authorLine}    <link rel="http://opds-spec.org/acquisition" href="${escapeXml(downloadUrl)}" type="${mime}"/>
    <link rel="http://opds-spec.org/image/thumbnail" href="${escapeXml(thumbnailUrl)}" type="image/webp"/>
  </entry>`;
    })
    .join("\n");

  return feedWrapper(
    `urn:kyomu:series:${seriesData.id}`,
    escapeXml(seriesData.title),
    now,
    selfUrl,
    `${baseUrl}/api/opds`,
    MIME_ACQUISITION,
    entries ? entries + "\n" : "",
  );
}
