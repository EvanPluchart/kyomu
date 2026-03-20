import Link from "next/link";
import { HorizontalScroll } from "@/components/library/horizontal-scroll";

interface ContinueReadingComic {
  comicId: number;
  comicTitle: string;
  seriesId: number | null;
  seriesTitle: string | null;
  currentPage: number;
  totalPages: number;
}

interface ContinueReadingProps {
  comics: ContinueReadingComic[];
}

export function ContinueReading({ comics }: ContinueReadingProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Continuer la lecture</h2>
      <HorizontalScroll>
        {comics.map((comic) => (
          <Link
            key={comic.comicId}
            href={`/read/${comic.comicId}`}
            className="group shrink-0 w-32 space-y-2"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
              <img
                src={`/api/comics/${comic.comicId}/thumbnail`}
                alt={comic.comicTitle}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-xs text-white text-center">
                {comic.currentPage}/{comic.totalPages}
              </div>
            </div>
            <p className="text-xs font-medium leading-tight line-clamp-2">
              {comic.comicTitle}
            </p>
          </Link>
        ))}
      </HorizontalScroll>
    </section>
  );
}
